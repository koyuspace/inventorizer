#!/usr/bin/python3
# pylint: disable=W0614
# pylint: disable=W1401
# pylint: disable=W0612

from bottle import *
import json
import redis
import random

r = redis.StrictRedis(host='localhost', port=6379, db=0)

def removebytes(s):
	return s.replace("b'", "").replace("'", "")

def isauthorized(authcode):
	f = open("authorized.txt", "r")
	a = f.readlines()
	f.close()
	authorized = False
	for s in a:
		authorizedl = s.split(":")[0]
		if authcode == authorizedl:
			authorized = True
	return authorized

def getalias(ga):
	ralias = None
	with open("authorized.txt", "r") as file:
		for line in file:
			authcode, alias = line.strip().split(':')
			if authcode == ga:
				ralias = alias
	return ralias

@get("/")
def index():
	return "<title>Inventorizer</title><p>This is the backend server for Inventorizer</p>"

@get("/api/v1/get/alias/<authcode>")
def getname(authcode):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.content_type = "application/json"
	return json.dumps({"alias": str(getalias(authcode)), "authcode": authcode})

@get("/api/v1/get/authorized/<authcode>")
def getauthorized(authcode):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.content_type = "application/json"
	return json.dumps({"authorized": str(isauthorized(authcode)).lower(), "authcode": authcode})

@get("/api/v1/get/entry/<device>/<authcode>")
def getentry(device, authcode):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.content_type = "application/json"
	if isauthorized(authcode):
		return r.get("inventorizer/device/" + device)
	else:
		return json.dumps({"authorized": str(isauthorized(authcode)).lower(), "authcode": authcode})

@post("/api/v1/new/entry/<authcode>")
def newentry(authcode):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.content_type = "application/json"
	if isauthorized(authcode):
		device_id = str(random.getrandbits(32))
		data = {}
		# pylint: disable=no-member
		data["ip"] = request.forms.get("ip")
		data["bill"] = request.forms.get("bill")
		data["boxn"] = request.forms.get("boxn")
		data["hostname"] = request.forms.get("hostname")
		data["location"] = request.forms.get("location")
		data["vendor"] = request.forms.get("vendor")
		data["type"] = request.forms.get("type")
		data["device"] = request.forms.get("device")
		data["deliverer"] = request.forms.get("deliverer")
		r.set("inventorizer/device/" + device_id, json.dumps(data))
		return json.dumps({"success": device_id})
	else:
		return json.dumps({"authorized": str(isauthorized(authcode)).lower(), "authcode": authcode})

@post("/api/v1/set/entry/<authcode>/<devid>")
def setentry(authcode, devid):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.content_type = "application/json"
	if isauthorized(authcode):
		device_id = devid
		data = {}
		# pylint: disable=no-member
		data["ip"] = request.forms.get("ip")
		data["bill"] = request.forms.get("bill")
		data["boxn"] = request.forms.get("boxn")
		data["hostname"] = request.forms.get("hostname")
		data["location"] = request.forms.get("location")
		data["vendor"] = request.forms.get("vendor")
		data["type"] = request.forms.get("type")
		data["device"] = request.forms.get("device")
		data["deliverer"] = request.forms.get("deliverer")
		r.set("inventorizer/device/" + device_id, json.dumps(data))
		return json.dumps({"success": device_id})
	else:
		return json.dumps({"authorized": str(isauthorized(authcode)).lower(), "authcode": authcode})

@get("/api/v1/delete/entry/<authcode>/<devid>")
def deleteentry(authcode, devid):
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.content_type = "application/json"
	if isauthorized(authcode):
		device_id = devid
		r.set("inventorizer/device/" + device_id, "")
		return json.dumps({"success": "true"})
	else:
		return json.dumps({"authorized": str(isauthorized(authcode)).lower(), "authcode": authcode})

run(server="tornado", host="0.0.0.0", port=8080)