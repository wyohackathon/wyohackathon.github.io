//----------------------------------------------------/
//
//      Author: Justin Thwaites
//      Version: v1.0
//      Update: July, 20 2020
//
//      create a dict form_settings with values: 
//		{
//			"Location": what location in Teams,
//			"Test": true or false,
//			"Redirect": redirect link after submission
//			"DZMessage": the Dropzone message given to be put in as default
//		}
//----------------------------------------------------/
var Form_ID = form_settings["TextFormID"];
var Location = form_settings["Location"];
var RedirectPage = form_settings["Redirect"];
var DZMessage = form_settings["DZMessage"];

if( form_settings["Test"]){
	var base_url = "http://127.0.0.1:5000/"
}
else{
	var base_url = "https://wyo01.wyohackathon.io/"
}

function ShowLoading() {
		var outerdiv = document.createElement('div');
        var div = document.createElement('div');
        var img = document.createElement('img');
        img.src = './assets/img/loading.gif';
        div.innerHTML = "Loading...<br />";
        div.style.cssText = 'position: fixed; top: 40%; display: block; left: 38%; right: auto; z-index: 5000; border-radius: 15px; width: 24%; height: 100px; text-align: center; background: #eeeeee; border: 1px solid #000';
        div.appendChild(img);
        document.body.appendChild(div);
        return true;
        // These 2 lines cancel form submission, so only use if needed.
        //window.event.cancelBubble = true;
        //e.stopPropagation();
    }


function getstamp(){
						var today = new Date();
						return today.getTime()
			}
			
		
Dropzone.options.uploadWidget = {
				paramName : "file",
				url : base_url + "upload",
				autoProcessQueue: true,
				maxFilesize: 4,
				dictDefaultMessage: DZMessage, 
				//maxFiles: 1,
				 success: function (file, response) {
                    if (this.files.length > 1)
                        this.removeFile(this.files[0]);
                    //Do others tasks...
                },
				init: function () {

					var myDropzone = this;
					
					this.on("error", function(file, message) { 
						alert(message);
						this.removeFile(file); 
						});
					
					this.on('sending', function(file, xhr, formData) {
					// Adds first and last name for desired filename
						var firstname = document.getElementById("fname").value;
						var lastname = document.getElementById("lname").value;
						var dateTime = getstamp();
						document.getElementById("file").value = dateTime + "." + file.name.split(".").pop();
						formData.append("FileName",  dateTime + "." + file.name.split(".").pop());
						formData.append("Location", Location);
						});
						
				}
			};
			
async function AddRow(Data, Success) {
	var myurl = base_url;
	$.ajax({
		type: 'POST',
		url: myurl,
		data: Data,
		success: Success,
		error: function() {
				window.location = RedirectPage;
				alert( "Something Went Wrong With Your Submission Please Email Justin@LODE.LLC With Your Information");}
		});         	
}


//Wrap all desired input in a form tag with your desired form ID, and put Sharepoint info on the API under Same Form Location
async function SubmitForm(){
	ShowLoading();
	var data = { 'Location':  Location}
	var form = document.getElementById(Form_ID);
	data["file"] = document.getElementById("file").value
	for (var i = 0; i < form.length; ++i) {
		if(form.elements[i].type == "checkbox"){
			data[form.elements[i].name] = form.elements[i].checked
		}
		else{
			data[form.elements[i].name] = form.elements[i].value
		}
	}
	AddRow(data, function() 
			{
				alert( "Your Form Has Been Submitted");
				window.location = RedirectPage;
			}); 
}