async function create(){
	try{
	const response = await fetch(
	"http://localhost:3000/api/v1/links",
	{
//		body: JSON.stringify(link),
		headers: {
			"Accept" : "application/json, text/plain, */*",
			"Content-Type": "application/json"
		},
		method : "GET"
	}
	);
	return await response.json();
	} catch (error){
		console.log(error);
	}
}