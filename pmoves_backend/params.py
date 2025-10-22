"""Parameter utilities for configuring the PMOVES simulator."""

from __future__ import annotations

from typing import Dict, Any

from .models import DEFAULT_PARAMS


def get_default_params() -> Dict[str, Any]:
    """Return a mutable copy of the default simulation parameters."""
    return dict(DEFAULT_PARAMS)


__all__ = ["DEFAULT_PARAMS", "get_default_params"]
