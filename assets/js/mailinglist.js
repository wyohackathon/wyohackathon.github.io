function checkform(email) { 
re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
 if (!(re.test(email))) {
	alert("Please enter a valid email address");
	jQuery("#email").focus();
	return false; }
	return true; } 


async function subscribe(email, page, list, fname, lname) {
  if(checkform(email)){
  successMessage = 'Thank you for your registration. Please check your email to confirm.';
  data =  "email="+email.replace("@","%40")+"&htmlemail=1&makeconfirmed=1&list%5B"+list+"%5D=signup&subscribe=subscribe&attribute5="+fname+"&attribute6="+lname;
  // alert(data);
  jQuery.ajax( 
	{ type: 'POST', data: data, url: "https://lists.wyohackathon.com/lists/?p=subscribe&id="+String(page), dataType: 'html', success: function (data, status, request) { 
		//alert(successMessage);
		}, error: function (request, status, error) { 
		//alert('Sorry, we were unable to process your subscription.');
		} });
  }
}

async function sub(email, list, fname, lname) {
	subscribe(email, 4, list, fname, lname);
	}