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
//          "Required_List": the fields that are required first element in the multiselect sublist[[]] is for the text to be colored
//		}
//----------------------------------------------------/
var Form_ID = form_settings["TextFormID"];
var Location = form_settings["Location"];
var RedirectPage = form_settings["Redirect"];
var DZMessage = form_settings["DZMessage"];
var Required_List = form_settings["Required_List"];

"Your Form Has Been Submitted"
if( form_settings["Success Message"]){
	var success_message = form_settings["Success Message"]
}
else{
	var success_message = "Your Form Has Been Submitted"
}


if( form_settings["Test"]){
	var base_url = "http://127.0.0.1:5000/"
}
else{
	var base_url = "https://wyo01.wyohackathon.io/"
}

//checks if the redirect needs to be specific of the input and outputs the string
function return_page(){
	if (RedirectPage.constructor == Array){
		var RP = RedirectPage[0];
		for (var i = 1; i < RedirectPage.length; ++i) {
			RP= RP.replace("{"+i+"}", document.getElementById(RedirectPage[i]).value);
		}
		return RP;
	}
	else{
		return RedirectPage;
	}
}

function CheckRequired(){
	var satisfied = true;
	var form = document.getElementById(Form_ID);
	for (var i = 0; i < Required_List.length; ++i) {
		if (Required_List[i].constructor == Array){
			if (Required_List[i][0]=="file"){// file handling
				if (!document.getElementById(Required_List[i][1]).value){
					alert("File upload is empty");
					document.getElementById(Required_List[i][2]).style.color = "red";
					satisfied = false;
				}
				else{
					document.getElementById(Required_List[i][2]).style.color = "black";
				}
			}
			else{//Checkbox handling
				var selection = false;
				for (var j = 1; j < Required_List[i].length; ++j) {
					if (Required_List[i][j].constructor == Array){// checkbox has fillout form
						if (document.getElementById(Required_List[i][j][0]).checked){
							if (!document.getElementById(Required_List[i][j][1]).value){
								alert(Required_List[i][j][1] + " cannot be empty if "+ Required_List[i][j][0]+ " is checked" );
								document.getElementById(Required_List[i][j][1]).style.borderColor = "red";
								satisfied = false;
								selection = true;
							}
							else{
								document.getElementById(Required_List[i][j][1]).style.borderColor = "black";
								selection = true;
							}
						}
					}
					else if (document.getElementById(Required_List[i][j]).checked){
						selection = true;
					}
					
				}
				if (!selection){
					satisfied = false;	
					if(Required_List[i].length ==2){
						alert(Required_List[i][0] + " must be checked");
					}
					else{
						alert(Required_List[i][0] + " cannot be empty");
					}
					document.getElementById(Required_List[i][0]).style.color = "red";
				}
				else{
					document.getElementById(Required_List[i][0]).style.color = "black";
				}
			}
		}
		else if (!document.getElementById(Required_List[i]).value){
			alert(Required_List[i] + " cannot be empty");
			document.getElementById(Required_List[i]).style.borderColor = "red";
			satisfied = false;
		}
		else{
			document.getElementById(Required_List[i]).style.borderColor = "black";
		}
	}
	return satisfied;
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
				alert( "Something Went Wrong With Your Submission Please Email admin@wyohackathon.io With Your Information");
				window.location = RedirectPage;
				}
		});         	
}


//Wrap all desired input in a form tag with your desired form ID, and put Sharepoint info on the API under Same Form Location
async function SubmitForm(){
	if(CheckRequired()){
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
					alert( success_message);
					window.location = return_page();
				}); 
	}
}