const Value = require('./Value.js');

export default {
	props: ['pAllowTypeFiltering'],

	data: function () {
		return {
			allowTypeFiltering: false
		}
	},

	watch: {
		pAllowTypeFiltering: {
			immediate: true,
			handler: function (value) {
				this.allowTypeFiltering = this.pAllowTypeFiltering || false;
			}
		},
		allowTypeFiltering: {
			immediate: true,
			handler: function (value) {
				this.readonly = !this.allowTypeFiltering;
			}
		},
		valueDescription: function () {
			this.filterItems();
		}
	},

	methods: {
		filterItems: function () {
			if (this.listIsVisible && this.allowTypeFiltering) {
				console.log(this.valueDescription);
				let searchString = this.valueDescription;
				let items = this.items;
				if (searchString && searchString !== '') {
					searchString = searchString.trim().toLowerCase();
					items = items.filter(function (item) {
						if (item.description.toLowerCase().indexOf(searchString) === 0) {
							return item;
						}
					});
				}
				this.filteredItems = items;
				this.$nextTick(this.updateHeight.bind(this));
			}
		}
	}
};