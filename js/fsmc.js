setHide("info_div", "info_selector", "Readme");
setHide("text_answer_div", "answer_text_selector", "Text answer");
setHide("table_div", "answer_table_selector", "Tables");
setHide("pdnf_div", "answer_pdnf_selector", "Сanonical equation");

document.getElementById("function-submit").onclick = function(){
	document.getElementById("text_answer_div").innerHTML = "<br>";
	document.getElementById("table_div").innerHTML = "<br>";
	document.getElementById("pdnf_div").innerHTML = "<br>";
	var input = document.getElementById('function-input');
	
	var ob = new StateMachine(input.value);
	ob.parseFunction();
	ob.setsInit();
	ob.calculateState();
	
	log(ob);
	
	var theDivText = document.getElementById("text_answer_div");
	theDivText.innerHTML += ob.toHtmlString();
	
	var theDivTable = document.getElementById("table_div");
	theDivTable.innerHTML += ob.state_table.toHtmlString();
	theDivTable.innerHTML += ob.sets_table.toHtmlString();
	
	var theDivDNF = document.getElementById("pdnf_div");
	theDivDNF.innerHTML += getDNFAnswerHtml(ob);
}

document.getElementById("info_selector").onclick = function(){
	setHide("info_div", "info_selector", "Readme");
}

document.getElementById("answer_text_selector").onclick = function(){
	setHide("text_answer_div", "answer_text_selector", "Text answer");
}

document.getElementById("answer_table_selector").onclick = function(){
	setHide("table_div", "answer_table_selector", "Tables");
}

document.getElementById("answer_pdnf_selector").onclick = function(){
	setHide("pdnf_div", "answer_pdnf_selector", "Сanonical equation");
}

function setHide(id, name, text) {
	var element = document.getElementById(id);
	if (element.style.display == 'none') {
		element.style.display = '';
		document.getElementById(name).innerHTML = "▼ " + text;
	} else {
		element.style.display = 'none';
		document.getElementById(name).innerHTML = "➤ " + text;
	}
}

function log(ob) {
	console.log(ob.summands);
	console.log(ob.states);
	console.log(ob.toString());
	console.log(ob.sets_table.toString());
}

function getDNFAnswerHtml(state_machine) {
	var canonical = state_machine.getCanonical();
	var st = "";
	for (var i = 0; i < canonical.length; i++) {
		st += "<p class='answer'>" + canonical[i].toString();
	}
	return st;
}