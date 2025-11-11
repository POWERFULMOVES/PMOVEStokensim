#!/usr/bin/env python3
"""
PMOVEStokensim → PMOVES-DoX Integration Script

This script automates the workflow:
1. Run PMOVEStokensim simulation
2. Export results to CSV
3. Upload to PMOVES-DoX for analysis
4. Generate dashboards
5. Extract insights via Q&A
"""

import argparse
import json
import random
import sys
import time
from datetime import date, datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
import requests

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from pmoves_backend import DEFAULT_PARAMS, run_simulation


class DoXIntegration:
    """Integration client for PMOVES-DoX"""

    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()

    def health_check(self) -> bool:
        """Check if DoX backend is running"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=5)
            return response.status_code == 200
        except Exception as e:
            print(f"❌ DoX health check failed: {e}")
            return False

    def upload_csv(self, csv_path: Path) -> Optional[Dict]:
        """Upload CSV file to DoX for analysis"""
        try:
            print(f"📤 Uploading {csv_path.name} to DoX...")

            with open(csv_path, "rb") as f:
                files = {"file": (csv_path.name, f, "text/csv")}
                response = self.session.post(
                    f"{self.base_url}/upload",
                    files=files,
                    timeout=60
                )

            if response.status_code == 200:
                result = response.json()
                print(f"✅ Upload successful! Document ID: {result.get('document_id', 'N/A')}")
                return result
            else:
                print(f"❌ Upload failed: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            print(f"❌ Upload error: {e}")
            return None

    def get_facts(self) -> List[Dict]:
        """Retrieve all extracted facts"""
        try:
            response = self.session.get(f"{self.base_url}/facts", timeout=10)
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"❌ Error fetching facts: {e}")
            return []

    def ask_question(self, question: str, use_hrm: bool = False) -> Optional[Dict]:
        """Ask a natural language question about the data"""
        try:
            print(f"❓ Asking: '{question}'")

            params = {"question": question}
            if use_hrm:
                params["use_hrm"] = "true"

            response = self.session.post(
                f"{self.base_url}/ask",
                params=params,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                answer = result.get("answer", "No answer")
                citations = result.get("citations", [])

                print(f"💡 Answer: {answer}")
                if citations:
                    print(f"📚 Citations: {len(citations)} sources")
                    for i, citation in enumerate(citations[:3], 1):
                        print(f"   {i}. {citation.get('text', '')[:100]}...")

                return result
            else:
                print(f"❌ Question failed: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ Question error: {e}")
            return None

    def run_chr_analysis(self, artifact_id: str, **kwargs) -> Optional[Dict]:
        """Run CHR (Constellation Harvest Regularization) analysis"""
        try:
            print(f"🔬 Running CHR analysis on artifact {artifact_id}...")

            payload = {
                "artifact_id": artifact_id,
                **kwargs
            }

            response = self.session.post(
                f"{self.base_url}/structure/chr",
                json=payload,
                timeout=120
            )

            if response.status_code == 200:
                result = response.json()
                print(f"✅ CHR analysis complete!")
                print(f"   MHEP: {result.get('mhep', 'N/A')}")
                print(f"   Hg: {result.get('Hg', 'N/A')}")
                print(f"   Hs: {result.get('Hs', 'N/A')}")
                return result
            else:
                print(f"❌ CHR analysis failed: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ CHR error: {e}")
            return None

    def generate_datavzrd_dashboard(self, artifact_id: str) -> Optional[Dict]:
        """Generate datavzrd dashboard from artifact"""
        try:
            print(f"📊 Generating datavzrd dashboard...")

            response = self.session.post(
                f"{self.base_url}/viz/datavzrd",
                json={"artifact_id": artifact_id},
                timeout=120
            )

            if response.status_code == 200:
                result = response.json()
                viz_url = result.get("viz_url", "http://localhost:5173")
                print(f"✅ Dashboard generated!")
                print(f"🌐 View at: {viz_url}")
                return result
            else:
                print(f"❌ Dashboard generation failed: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ Dashboard error: {e}")
            return None

    def search(self, query: str, k: int = 5, types: Optional[List[str]] = None) -> List[Dict]:
        """Search indexed documents"""
        try:
            payload = {"q": query, "k": k}
            if types:
                payload["types"] = types

            response = self.session.post(
                f"{self.base_url}/search",
                json=payload,
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                results = result.get("results", [])
                print(f"🔍 Found {len(results)} results for '{query}'")
                return results
            return []

        except Exception as e:
            print(f"❌ Search error: {e}")
            return []

    def get_artifacts(self) -> List[Dict]:
        """Get list of all artifacts"""
        try:
            response = self.session.get(f"{self.base_url}/artifacts", timeout=10)
            if response.status_code == 200:
                return response.json()
            return []
        except Exception as e:
            print(f"❌ Error fetching artifacts: {e}")
            return []


class SimulationExporter:
    """Run the simulation and export structured outputs."""

    def __init__(
        self,
        params: Optional[Dict[str, Any]] = None,
        random_seed: Optional[int] = None,
    ) -> None:
        self.params = params or {}
        self.random_seed = random_seed
        if random_seed is not None:
            random.seed(random_seed)
            np.random.seed(random_seed)

    def export_simulation_data(self, output_dir: Path, scenario_name: str = "test") -> Dict[str, Path]:
        """Run the PMOVEStokensim model and persist export artifacts."""
        try:
            print(f"📊 Exporting simulation data to {output_dir}...")
            output_dir.mkdir(parents=True, exist_ok=True)

            params = DEFAULT_PARAMS.copy()
            params.update(self.params)
            params.setdefault("description", scenario_name)

            results = run_simulation(params)

            history = results.get("history", [])
            members = results.get("final_members", [])
            key_events = results.get("key_events", [])
            summary_text = results.get("summary", "")

            history_path = self._write_history(history, output_dir, scenario_name)
            members_path = self._write_members(members, output_dir, scenario_name)
            events_path = self._write_events(key_events, output_dir, scenario_name)
            summary_stats_path = self._write_summary_stats(results, output_dir, scenario_name)
            summary_text_path = self._write_summary_text(summary_text, output_dir, scenario_name)
            bundle_path = self._write_bundle(results, output_dir, scenario_name)

            artifacts: Dict[str, Path] = {}
            if history_path:
                artifacts["history"] = history_path
            if members_path:
                artifacts["members"] = members_path
            if events_path:
                artifacts["events"] = events_path
            if summary_stats_path:
                artifacts["summary_stats"] = summary_stats_path
            if summary_text_path:
                artifacts["summary_text"] = summary_text_path
            if bundle_path:
                artifacts["bundle"] = bundle_path

            if not artifacts:
                raise ValueError("No export files were generated.")

            print(f"✅ Exported {len(artifacts)} artifacts")
            return artifacts

        except Exception as exc:
            print(f"❌ Export error: {exc}")
            return {}

    def _write_history(
        self,
        history: List[Dict[str, Any]],
        output_dir: Path,
        scenario_name: str,
    ) -> Optional[Path]:
        if not history:
            return None

        df = pd.DataFrame(history)

        for column_name, prefix in (
            ("WealthQuintiles_A", "WealthQuintile_A_Q"),
            ("WealthQuintiles_B", "WealthQuintile_B_Q"),
        ):
            if column_name in df:
                expanded = df[column_name].apply(
                    lambda value: value if isinstance(value, list) else []
                )
                quintile_df = pd.DataFrame(
                    expanded.tolist(),
                    columns=[f"{prefix}{idx}" for idx in range(1, 5)],
                )
                df = df.drop(columns=[column_name]).join(quintile_df)

        history_path = output_dir / f"{scenario_name}_history.csv"
        df.to_csv(history_path, index=False)
        print(f"✅ Created {history_path.name}")
        return history_path

    def _write_members(
        self,
        members: List[Dict[str, Any]],
        output_dir: Path,
        scenario_name: str,
    ) -> Optional[Path]:
        if not members:
            return None

        members_path = output_dir / f"{scenario_name}_members.csv"
        pd.DataFrame(members).to_csv(members_path, index=False)
        print(f"✅ Created {members_path.name}")
        return members_path

    def _write_events(
        self,
        events: List[Dict[str, Any]],
        output_dir: Path,
        scenario_name: str,
    ) -> Optional[Path]:
        if not events:
            return None

        events_path = output_dir / f"{scenario_name}_events.csv"
        pd.DataFrame(events).to_csv(events_path, index=False)
        print(f"✅ Created {events_path.name}")
        return events_path

    def _write_summary_stats(
        self,
        results: Dict[str, Any],
        output_dir: Path,
        scenario_name: str,
    ) -> Optional[Path]:
        history = results.get("history", [])
        if not history:
            return None

        first_week = history[0]
        last_week = history[-1]
        member_count = len(results.get("final_members", []))

        def _as_float(value: Any) -> Optional[float]:
            try:
                return float(value)
            except (TypeError, ValueError):
                return None

        stats = [
            {"Metric": "Simulation Duration (weeks)", "Value": len(history), "Category": "General"},
            {
                "Metric": "Simulation Duration (years)",
                "Value": round(len(history) / 52, 2),
                "Category": "General",
            },
            {"Metric": "Number of Members", "Value": member_count, "Category": "General"},
        ]

        for label, metric_key in (
            ("Initial Avg Wealth A", "AvgWealth_A"),
            ("Initial Avg Wealth B", "AvgWealth_B"),
            ("Initial Gini A", "Gini_A"),
            ("Initial Gini B", "Gini_B"),
        ):
            stats.append(
                {
                    "Metric": label,
                    "Value": _as_float(first_week.get(metric_key)),
                    "Category": "Initial",
                }
            )

        for label, metric_key in (
            ("Final Avg Wealth A", "AvgWealth_A"),
            ("Final Avg Wealth B", "AvgWealth_B"),
            ("Final Gini A", "Gini_A"),
            ("Final Gini B", "Gini_B"),
        ):
            stats.append(
                {
                    "Metric": label,
                    "Value": _as_float(last_week.get(metric_key)),
                    "Category": "Final",
                }
            )

        def _pct_change(old: Any, new: Any) -> Optional[float]:
            old_val = _as_float(old)
            new_val = _as_float(new)
            if old_val is None or new_val is None or abs(old_val) < 1e-6:
                return None
            return round((new_val - old_val) / old_val * 100, 2)

        stats.extend(
            [
                {
                    "Metric": "Wealth Growth A (%)",
                    "Value": _pct_change(first_week.get("AvgWealth_A"), last_week.get("AvgWealth_A")),
                    "Category": "Change",
                },
                {
                    "Metric": "Wealth Growth B (%)",
                    "Value": _pct_change(first_week.get("AvgWealth_B"), last_week.get("AvgWealth_B")),
                    "Category": "Change",
                },
                {
                    "Metric": "Cooperative Advantage (%)",
                    "Value": _pct_change(last_week.get("AvgWealth_A"), last_week.get("AvgWealth_B")),
                    "Category": "Change",
                },
                {
                    "Metric": "Gini Improvement A (%)",
                    "Value": _pct_change(first_week.get("Gini_A"), last_week.get("Gini_A")),
                    "Category": "Change",
                },
                {
                    "Metric": "Gini Improvement B (%)",
                    "Value": _pct_change(first_week.get("Gini_B"), last_week.get("Gini_B")),
                    "Category": "Change",
                },
                {
                    "Metric": "Key Events Count",
                    "Value": len(results.get("key_events", [])),
                    "Category": "Events",
                },
            ]
        )

        summary_stats_path = output_dir / f"{scenario_name}_summary_statistics.csv"
        pd.DataFrame(stats).to_csv(summary_stats_path, index=False)
        print(f"✅ Created {summary_stats_path.name}")
        return summary_stats_path

    def _write_summary_text(
        self,
        summary_text: Any,
        output_dir: Path,
        scenario_name: str,
    ) -> Optional[Path]:
        if not summary_text:
            return None

        summary_path = output_dir / f"{scenario_name}_summary.txt"
        with summary_path.open("w", encoding="utf-8") as handle:
            handle.write(str(summary_text).strip() + "\n")
        print(f"✅ Created {summary_path.name}")
        return summary_path

    def _write_bundle(
        self,
        results: Dict[str, Any],
        output_dir: Path,
        scenario_name: str,
    ) -> Optional[Path]:
        if not results:
            return None

        bundle_path = output_dir / f"{scenario_name}_complete.json"
        with bundle_path.open("w", encoding="utf-8") as handle:
            json.dump(results, handle, indent=2, default=_json_serializer)
        print(f"✅ Created {bundle_path.name}")
        return bundle_path


def _json_serializer(value: Any) -> Any:
    """Coerce numpy and path objects into JSON-friendly primitives."""
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, (list, tuple)):
        return [_json_serializer(item) for item in value]
    if isinstance(value, dict):
        return {str(k): _json_serializer(v) for k, v in value.items()}
    return value


def run_integration_workflow(
    dox_url: str = "http://localhost:8001",
    scenario_name: str = "test_scenario",
    export_dir: Optional[Path] = None,
    params: Optional[Dict[str, Any]] = None,
    random_seed: Optional[int] = None,
):
    """Run the complete integration workflow"""

    print("=" * 70)
    print("🚀 PMOVEStokensim → PMOVES-DoX Integration")
    print("=" * 70)
    print()

    # Initialize clients
    dox = DoXIntegration(dox_url)
    exporter = SimulationExporter(params=params, random_seed=random_seed)

    # Step 1: Health check
    print("Step 1: Checking DoX availability...")
    if not dox.health_check():
        print("❌ DoX is not available. Ensure the backend is running (e.g., docker compose -f docker-compose.cpu.yml up -d).")
        return False
    print("✅ DoX is running!\n")
    time.sleep(1)

    # Step 2: Export simulation data
    print("Step 2: Exporting simulation data...")
    if export_dir is None:
        base_dir = Path(__file__).resolve().parent.parent
        export_dir = base_dir / "exports" / datetime.now().strftime("%Y%m%d_%H%M%S")

    exports = exporter.export_simulation_data(export_dir, scenario_name)
    if not exports:
        print("❌ Export failed!")
        return False
    print("✅ Export complete!\n")
    time.sleep(1)

    # Step 3: Upload to DoX
    print("Step 3: Uploading to DoX for analysis...")
    history_path = exports.get("history")
    if not history_path or not history_path.exists():
        print("❌ No history file to upload!")
        return False

    upload_result = dox.upload_csv(history_path)
    if not upload_result:
        print("❌ Upload failed!")
        return False

    artifact_id = upload_result.get("artifact_id") or upload_result.get("document_id")
    if artifact_id:
        print(f"✅ Uploaded! Artifact ID: {artifact_id}\n")
    else:
        print("⚠️ Upload succeeded but no artifact identifier was returned. Some analysis steps will be skipped.\n")
    time.sleep(2)

    # Step 4: Extract facts
    print("Step 4: Extracting facts...")
    facts = dox.get_facts()
    print(f"✅ Extracted {len(facts)} facts\n")
    time.sleep(1)

    # Step 5: Run Q&A
    print("Step 5: Testing Q&A capabilities...")
    questions = [
        "What was the final average wealth in scenario B?",
        "How did the Gini coefficient change over time?",
        "What was the poverty rate in week 1 vs week 52?"
    ]

    for question in questions:
        dox.ask_question(question)
        print()
        time.sleep(1)

    # Step 6: Search
    print("Step 6: Testing search...")
    dox.search("wealth scenario B", k=3)
    print()
    time.sleep(1)

    # Step 7: CHR Analysis
    chr_result = None
    if artifact_id:
        print("Step 7: Running CHR analysis...")
        chr_result = dox.run_chr_analysis(artifact_id, K=5, iters=10)
        print()
        time.sleep(1)
    else:
        print("Step 7: Skipping CHR analysis (no artifact ID available).\n")

    # Step 8: Generate Dashboard
    if artifact_id and chr_result:
        print("Step 8: Generating datavzrd dashboard...")
        dox.generate_datavzrd_dashboard(artifact_id)
        print()
    elif artifact_id:
        print("Step 8: Skipping dashboard generation (CHR analysis did not complete successfully).\n")
    elif not artifact_id:
        print("Step 8: Skipping dashboard generation (no artifact ID available).\n")

    # Summary
    print("=" * 70)
    print("✅ Integration workflow complete!")
    print("=" * 70)
    print()
    print("📊 What you can do now:")
    print("1. View frontend: http://localhost:3000")
    print("2. View dashboard: http://localhost:5173")
    print("3. API docs: http://localhost:8001/docs")
    print()
    print("🔍 Artifact ID for this run:", artifact_id or "N/A")
    print("📁 Exported files:", export_dir)
    print()

    return True


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Integrate PMOVEStokensim with PMOVES-DoX"
    )
    parser.add_argument(
        "--dox-url",
        default="http://localhost:8001",
        help="PMOVES-DoX backend URL (default: http://localhost:8001; adjust for local runs)"
    )
    parser.add_argument(
        "--scenario",
        default="integration_test",
        help="Scenario name for exports"
    )
    parser.add_argument(
        "--export-dir",
        type=Path,
        help="Custom export directory"
    )
    parser.add_argument(
        "--params-file",
        type=Path,
        help="Optional JSON file with simulation parameter overrides"
    )
    parser.add_argument(
        "--seed",
        type=int,
        help="Random seed for reproducible simulation runs"
    )
    parser.add_argument(
        "--health-only",
        action="store_true",
        help="Only check DoX health and exit"
    )

    args = parser.parse_args()

    params_data: Optional[Dict[str, Any]] = None
    if args.params_file:
        try:
            with args.params_file.open("r", encoding="utf-8") as handle:
                loaded = json.load(handle)
            if not isinstance(loaded, dict):
                raise ValueError("Parameter file must contain a JSON object.")
            params_data = {}
            for key, value in loaded.items():
                if isinstance(value, bool):
                    params_data[key] = value
                elif isinstance(value, (int, float)):
                    params_data[key] = float(value)
                else:
                    params_data[key] = value
        except Exception as exc:
            print(f"❌ Failed to load parameter file: {exc}")
            sys.exit(1)

    if args.health_only:
        dox = DoXIntegration(args.dox_url)
        if dox.health_check():
            print("✅ DoX is running!")
            sys.exit(0)
        else:
            print("❌ DoX is not available")
            sys.exit(1)

    success = run_integration_workflow(
        dox_url=args.dox_url,
        scenario_name=args.scenario,
        export_dir=args.export_dir,
        params=params_data,
        random_seed=args.seed,
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
