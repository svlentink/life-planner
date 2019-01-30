#!/usr/bin/env python

import yaml
import json

obj = {}
with open("personal_brand.yml", 'r') as ymlfile:
  obj = yaml.load(ymlfile)

with open('data.json', 'w') as fp:
  json.dump(obj, fp, default=str)
