var Value = function(config) {
	config = config || {};
	this.id = config.id || null;
	this.description = config.description || '';
	this.value = config.value || config.description;

};

Value.prototype.setValue = function(value) {
	this.value = value;
}

module.exports = Value;