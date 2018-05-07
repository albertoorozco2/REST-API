


(async function read(){
	console.log("here");
	try{
	const response = await fetch(
	"http://localhost:3000/api/v1/links",
	{

//		body: JSON.stringify(link),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method : "GET"
	}
	);
	return await response.json();
	} catch (error){
		console.log(error);
	}
})();