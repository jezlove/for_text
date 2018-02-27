function extractNumber(inputField) {
	var text = "" + inputField.value;
	if(!text.match(/^\d+$/g)) { return(null); }
	var n = parseInt(text);
	return({number: n});
}

function getVariable(letter) {

	var usingCheckBox = document.getElementById(letter + "Use");
	var minimumInputField = document.getElementById(letter + "Min");
	var maximumInputField = document.getElementById(letter + "Max");

	if(!usingCheckBox || !minimumInputField || !maximumInputField) { return(null); }

	var use = usingCheckBox.checked;
	var min = extractNumber(minimumInputField);
	var max = extractNumber(maximumInputField);

	if(!min || !max || min > max) { return(null); }

	return({name: letter, using: use, minimum: min.number, maximum: max.number});
}

function sanitize(s) {
	return(s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
}

function format(s) {
	return('<div>' + sanitize(s) + '</div>');
}

function perform(s, variable, value) {
	return(s.replace("$" + variable.name, "" + value));
}

function generate() {

	var inputTextField = document.getElementById("inputTextField");
	if(!inputTextField) { return; }
	var inputText = "" + inputTextField.value;

	var outputTextField = document.getElementById("outputTextField");
	if(!outputTextField) { return; }
	var outputText = "";

	var iVariable = getVariable("i");
	var jVariable = getVariable("j");
	var kVariable = getVariable("k");

	var variables = [];

	if(iVariable && iVariable.using) { variables.push(iVariable); }
	if(jVariable && jVariable.using) { variables.push(jVariable); }
	if(kVariable && kVariable.using) { variables.push(kVariable); }

	if(variables.length > 0) {

		for(var i = variables[0].minimum; i < variables[0].maximum; i++) {

			if(variables.length > 1) {
				for(var j = variables[1].minimum; j < variables[1].maximum; j++) {

					if(variables.length > 2) {
						for(var k = variables[2].minimum; k < variables[2].maximum; k++) {
							{
								outputText += format(
									perform(perform(perform(inputText, variables[0], i), variables[1], j), variables[2], k)
								);
							}
						}
					}
					else {
						outputText += format(
							perform(perform(inputText, variables[0], i), variables[1], j)
						);
					}
				}
			}
			else {
				outputText += format(
					perform(inputText, variables[0], i)
				);
			}
		}
	}

	outputTextField.innerHTML = outputText;
}