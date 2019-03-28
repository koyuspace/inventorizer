document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	const url = "https://tsbw.koyu.space";
	$(".scan").show();
	$("#entry").hide();
	$.get(url + "/api/v1/get/authorized/" + $.md5(device.uuid), function(data) {
		if (data["authorized"] === "false") {
			alert("Your device is not authorized to access this application. For this reason the application must be terminated. More information can be retrieved from the log below." + "\n\n" + JSON.stringify(data));
			navigator.app.exitApp();
		}
	}).fail(function() {
		alert("Your device is not authorized to access this application. For this reason the application must be terminated. More information can be retrieved from the log below." + "\n\n" + JSON.stringify(data));
		navigator.app.exitApp();
	});
	$("#dev-delbutton").click(function() {
	$.get(url + "/api/v1/get/entry/" + $("#deviceid").val() + "/" +  $.md5(device.uuid), function(data) {
		if (confirm("Are you sure you want to delete that entry?\n\n" + JSON.stringify(data))) {
		$.get(url + "/api/v1/delete/entry/" + $.md5(device.uuid) + "/" + $("#deviceid").val(), function(data) {
			$(".scan").show();
			$("#entry").hide();
		}).fail(function() {
			alert("An error occured while deleting this entry.", "{\"success\": \"false\"}");
			$(".scan").show();
			$("#entry").hide();
		});
		}
	}).fail(function() {
		alert("An error occured while deleting this entry.", "{\"success\": \"false\"}");
		$(".scan").show();
		$("#entry").hide();
	});
});
$("#btn-transmit").click(function() {
	$.post(url + "/api/v1/set/entry/" + $.md5(device.uuid) + "/" + $("#deviceid").val(), {
		ip: $("#newdev-ip").val(),
		bill: $("#newdev-ino").val(),
		boxn: $("#newdev-bno").val(),
		hostname: $("#newdev-hostname").val(),
		location: $("#newdev-location").val(),
		vendor: $("#newdev-vendor").val(),
		type: $("#newdev-type").val(),
		device: $("#newdev-device").val(),
		deliverer: $("#newdev-deliverer").val()
	}, function(data) {
		$(".scan").show();
		$("#entry").hide();
	}).fail(function() {
		alert("An error occured while transferring the data to the database. This can be either traced back to an unstable or non-existant internet connection.\n\n{\"success\": \"false\"}");
		$(".scan").show();
		$("#entry").hide();
	});
});
$("#scan").click(function() {
	cordova.plugins.barcodeScanner.scan(
		function (result) {
		$.get(url + "/api/v1/get/entry/" + result.text + "/" + $.md5(device.uuid), function(data) {
			if (data === "") {
				alert("This device doesn't exist.");
			}
			console.log(JSON.stringify(data));
			$(".scan").hide();
			$("#entry").show();
			$("#deviceid").val(result.text);
			$("#newdev-ip").val(data["ip"]);
			$("#newdev-ino").val(data["bill"]);
			$("#newdev-bno").val(data["boxn"]);
			$("#newdev-hostname").val(data["hostname"]);
			$("#newdev-location").val(data["location"]);
			$("#newdev-vendor").val(data["vendor"]);
			$("#newdev-type").val(data["type"]);
			$("#newdev-device").val(data["device"]);
			$("#newdev-deliverer").val(data["deliverer"]);
		}).fail(function() {
			alert("This device doesn't exist.");
		});
		},
		function (error) {
			alert("Scanning failed: " + error);
		},
		{
			preferFrontCamera : false,
			showFlipCameraButton : false,
			showTorchButton : false,
			torchOn: false,
			saveHistory: false,
			prompt : "Place a barcode inside the scan area",
			resultDisplayDuration: 0,
			formats : "QR_CODE",
			orientation : "portrait",
			disableAnimations : true,
			disableSuccessBeep: false
		}
		);
	});
}