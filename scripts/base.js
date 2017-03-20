var	inputVal = document.querySelectorAll('#inputFile');

Array.prototype.forEach.call( inputVal, function( inputVal ){
	var label = inputVal.nextElementSibling,
		labelVal;
		labelVal = label.innerHTML;
	/*
	TO genearate the table which contains name list of all the files uploaded
	*/
	inputVal.addEventListener('change',function(e){
		if( this.files && this.files.length > 0 ){
			document.getElementById("uploadDetails").style.visibility = "visible";
			var namesOfFilesHtml = "",
				noOfFiles;
			noOfFiles =  this.files.length ;
			for(i=0;i<this.files.length;i++){
				namesOfFilesHtml = namesOfFilesHtml + '<tr><td>' + this.files[i].name + '</td><tr>' ;
			}
			inputVal.parentNode.parentElement.nextElementSibling.querySelector('#uploadDetailsHead').innerHTML = "<tr><th> No of file selected : " + noOfFiles + "</th></tr>";
			inputVal.parentNode.parentElement.nextElementSibling.querySelector('#uploadDetailsBody').innerHTML = namesOfFilesHtml;
			document.getElementById("uploadStatus").style.visibility = "hidden";
		}
	});
});

document.getElementById("uploadFilesBtn").addEventListener("click", function(event){
	document.getElementById("uploadDetails").style.visibility = "hidden";
	var filesToUpload  = fileArrayGenearator();
	console.log(filesToUpload);
	if(filesToUpload){
		var httpReq,
			reqUrl = "",
			method = "POST";
		var httpReq = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		httpReq.open(method,reqUrl);
		httpReq.send(filesToUpload);
		httpReq.addEventListener("load", function(){
			if(httpReq.status=="200"){
				document.getElementById("uploadStatus").innerHTML = "Uploading Completed.";
			}else {
				document.getElementById("uploadStatus").innerHTML = "Uploading Failed.";
			}
			document.getElementById("uploadStatus").style.visibility = "visible";
		});
	}
	return false;
});

/*
Generate an array of object where object contains the data and file name of files upload
*/
function fileArrayGenearator(){
	var input = document.getElementById('inputFile'),
		noOfFile = input.files.length;
	if(input.files.length==0){
		document.getElementById("uploadStatus").innerHTML = "Please choose a file to perform upload";
		document.getElementById("uploadStatus").style.visibility = "visible";
		return false;
	}else if(window.FileReader){
		var pushCounter=0,
			uploadFileList=[],
			files = document.getElementById('inputFile').files;
		for(i=0;i<noOfFile;i++){
			var fileObject={};
			fileObject.name = input.files[i].name;
			uploadFileList.push(fileObject)
		}
		for (i=0;i<files.length;i++) {
			var reader = new FileReader();
			reader.onload = function (evt) {
				var fileObject={};
				if (evt.target.readyState == FileReader.DONE) {
					uploadFileList[pushCounter].data =  btoa(evt.target.result);
					pushCounter++;
				}
			};
			reader.readAsBinaryString(files[i]);
		}
		return uploadFileList;
	}else{
		alert('The File API not fully supported in this browser');
		return false;
	}
}
