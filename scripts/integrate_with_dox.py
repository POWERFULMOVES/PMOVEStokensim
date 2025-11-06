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
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional

import requests
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


class DoXIntegration:
    """Integration client for PMOVES-DoX"""

    def __init__(self, base_url: str = "http://localhost:8000"):
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
    """Handle PMOVEStokensim data export"""

    @staticmethod
    def export_simulation_data(output_dir: Path, scenario_name: str = "test") -> Dict[str, Path]:
        """Export simulation data to CSV files"""
        try:
            # This would normally run the simulation
            # For now, we'll create sample data
            print(f"📊 Exporting simulation data to {output_dir}...")

            output_dir.mkdir(parents=True, exist_ok=True)

            # Create sample simulation history CSV
            import pandas as pd
            import numpy as np

            weeks = 52
            history_data = {
                "Week": range(1, weeks + 1),
                "Year": [(w-1) // 52 + 1 for w in range(1, weeks + 1)],
                "AvgWealth_A": [1000 + w * 10 + np.random.normal(0, 50) for w in range(weeks)],
                "AvgWealth_B": [1000 + w * 15 + np.random.normal(0, 50) for w in range(weeks)],
                "Gini_A": [0.3 + w * 0.001 + np.random.normal(0, 0.01) for w in range(weeks)],
                "Gini_B": [0.3 - w * 0.001 + np.random.normal(0, 0.01) for w in range(weeks)],
                "PovertyRate_A": [0.15 - w * 0.001 + np.random.normal(0, 0.01) for w in range(weeks)],
                "PovertyRate_B": [0.15 - w * 0.002 + np.random.normal(0, 0.01) for w in range(weeks)],
            }

            df = pd.DataFrame(history_data)
            history_path = output_dir / f"{scenario_name}_history.csv"
            df.to_csv(history_path, index=False)

            print(f"✅ Created {history_path.name}")

            return {
                "history": history_path
            }

        except Exception as e:
            print(f"❌ Export error: {e}")
            return {}


def run_integration_workflow(
    dox_url: str = "http://localhost:8000",
    scenario_name: str = "test_scenario",
    export_dir: Optional[Path] = None
):
    """Run the complete integration workflow"""

    print("=" * 70)
    print("🚀 PMOVEStokensim → PMOVES-DoX Integration")
    print("=" * 70)
    print()

    # Initialize clients
    dox = DoXIntegration(dox_url)
    exporter = SimulationExporter()

    # Step 1: Health check
    print("Step 1: Checking DoX availability...")
    if not dox.health_check():
        print("❌ DoX is not available. Make sure it's running:")
        print("   cd /home/user/PMOVES-DoX")
        print("   docker compose -f docker-compose.cpu.yml up -d")
        return False
    print("✅ DoX is running!\n")
    time.sleep(1)

    # Step 2: Export simulation data
    print("Step 2: Exporting simulation data...")
    if export_dir is None:
        export_dir = Path("/home/user/PMOVEStokensim/exports") / datetime.now().strftime("%Y%m%d_%H%M%S")

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

    artifact_id = upload_result.get("artifact_id")
    print(f"✅ Uploaded! Artifact ID: {artifact_id}\n")
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
    print("Step 7: Running CHR analysis...")
    chr_result = dox.run_chr_analysis(artifact_id, K=5, iters=10)
    print()
    time.sleep(1)

    # Step 8: Generate Dashboard
    if chr_result:
        print("Step 8: Generating datavzrd dashboard...")
        viz_result = dox.generate_datavzrd_dashboard(artifact_id)
        print()

    # Summary
    print("=" * 70)
    print("✅ Integration workflow complete!")
    print("=" * 70)
    print()
    print("📊 What you can do now:")
    print("1. View frontend: http://localhost:3000")
    print("2. View dashboard: http://localhost:5173")
    print("3. API docs: http://localhost:8000/docs")
    print()
    print("🔍 Artifact ID for this run:", artifact_id)
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
        default="http://localhost:8000",
        help="PMOVES-DoX backend URL (default: http://localhost:8000)"
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
        "--health-only",
        action="store_true",
        help="Only check DoX health and exit"
    )

    args = parser.parse_args()

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
        export_dir=args.export_dir
    )

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
