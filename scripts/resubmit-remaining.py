#!/usr/bin/env python3
"""Submit the public tool catalog through IndexNow.

The old first-100 skip belonged to a retired key. This submits the same
catalog as resubmit-urls.py, including image tools at /tools/images/<slug>.
"""
from indexnow_catalog import main

if __name__ == '__main__':
    main()
