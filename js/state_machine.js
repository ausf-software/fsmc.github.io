function createBinaryString (nMask) {
  // nMask must be between -2147483648 and 2147483647
  for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
       nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
  return sMask;
}

class StateMachine {
	
	func;
	summands;
	setSize;
	sets;
	states;
	isNumber;

    constructor (func) {
        this.func = func;
		this.summands = [];
		this.setSize = 0;
		this.sets = [];
		this.states = [];
		this.isNumber = false;
	}
	
	parseFunction() {
		var temp = this.func;
		temp = temp.replace("-", "+-");
		var sum = temp.split("+");
		
		var regIsNumber = new RegExp("^[0-9-]+$");
		
		for (let i = 0; i < sum.length; i++) {
			
			var type = regIsNumber.test(sum[i]) ? 1 : 0;
			var operation = sum[i].at(0) == '-' ? 1 : 0;
			sum[i] = sum[i].replace("-", "");
			var sub = sum[i].split("*");
			var value = Number(sub[0]);
			var name = type == 1 ? "number" : sub[1];
			
			if (type == 0) this.setSize++;
			else this.isNumber = true;
			
			this.summands.push(new Parametr(type, value, operation, name));
		}
	}
	
	setsInit() {
		var count = 2**this.setSize;
		
		for (var i = 0; i < count; i++) {
			var str = createBinaryString(i).slice(32 - this.setSize);
			this.sets.push(new Set(this.setSize, str.split("")));
		}
	}
	
	calculateState() {
		if (!this.isNumber) {
			this.states.push(new State("+0", 0, 0, 0));
		} else {
			for(var item of this.summands) {
				if (item.type == 1) {
					var temp = (item.operation == 1 ? "-" : "+") + item.value;
					this.states.push(new State(temp, 0, item.operation, item.value));
					break;
				}
			}
		}
		var max = 1;
		for (var mark = 0; mark < max; mark++) {
			for (var set of this.sets) {
				var temp = this.states[mark].value * (this.states[mark].operation == 1 ? -1 : 1);
				for (var i = 0; i < set.size; i++) {
					temp += set.values[i] * this.summands[i].value * (this.summands[i].operation == 1 ? -1 : 1);
				}
				
				var new_state_operation = temp >= 0 ? 0 : 1;
				temp *= temp >= 0 ? 1 : -1;
				
				var binary = temp.toString(2);
				
				var res;
				if (new_state_operation == 1 && Number(binary.at(binary.length - 1)) == 1) {
					temp += 2;
					binary = temp.toString(2);
				}
				res = Number(binary.at(binary.length - 1));
				
				var state;
				if (binary.length != 1) {
					state = binary.substring(0, binary.length - 1);
				} else {
					state = "0";
				}
				
				var vl = parseInt(state, 2);
				var name = (new_state_operation == 0 ? "+" : "-") + vl;
				
				var flag = -1;
				for (var k  = 0; k < this.states.length; k++) {
					if (this.states[k].name == name) { 
						flag = k;
						break;
					}
				}
				
				if (flag == -1) {
					var st = new State(name, 1, new_state_operation, vl);
					this.states.push(st);
					this.states[mark].addTransition(set, name, res);
					max++;
				} else {
					this.states[mark].addTransition(set, this.states[flag].name, res);
				}
			}
		}
	}
	
	toString() {
		var st = "";
		st += "Исходная функция : " + this.func + "\n";
		st += "Количество переменных : " + this.setSize + "\n\n";
		for (var i = 0; i < this.states.length; i++) {
			st += "Из состояния " + this.states[i].name + ":\n";
			for (var k = 0; k < this.sets.length; k++) {
				st += "		в состояние: " + this.states[i].trans[k].toString() + "\n";
			}
			st += "\n";
		}
		return st;
	}
	
};