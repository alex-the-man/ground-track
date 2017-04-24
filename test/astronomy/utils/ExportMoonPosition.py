#!/usr/bin/env python
# Export moon ecliptic position from pyephem for unit test.

from datetime import datetime
import json
import os
import calendar
import math
import ephem
from ephem import Ecliptic, degrees

from pytz import utc

moon = ephem.Moon()

positions = []

def utc_time(*args):
    return datetime(*args, tzinfo=utc)

def export(start_datetime, end_datetime, num_samples):
    dt = (end_datetime - start_datetime) / num_samples
    for i in range(num_samples):
        t = start_datetime + i * dt
        ts = calendar.timegm(t.utctimetuple())
        moon.compute(t)

        ecliptic_pos = Ecliptic(moon)
        positions.append(dict(timestamp=ts, lon=ecliptic_pos.lon, lat=ecliptic_pos.lat))

# Example 47.a but with pyephem output.
export(utc_time(1992, 4, 12), utc_time(1992, 4, 13), 1)

# Epoch test
export(utc_time(2000, 1, 1, 12, 0, 0), utc_time(2000, 1, 2, 12, 0, 0), 1)

# Long term test
export(utc_time(2000, 1, 1, 12, 0, 0), utc_time(2051, 1, 1, 12, 0, 0), 50)

# Short term test
export(utc_time(2017, 1, 1, 12, 0, 0), utc_time(2018, 1, 1, 12, 0, 0), 366)

base_dir = os.path.dirname(os.path.realpath(__file__))
json_output = open(base_dir + "/../MoonPosition.json", "w")
json.dump(positions, json_output)
json_output.close()
