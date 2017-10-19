<template>
	<div>
		<div :class="['z-dropdown-arrow',{'hidden': isLoading}]" @click="toggle($event)">
			<loader class="loader-position" v-if="isLoading"/>
			<input
					:class="['form-control', 'form-control-sm', 'z-input',
					{'isLoading': isLoading || isSynchronizing}]"
					:id="id+'-input'"
					v-model="valueDescription"
					:data-selected-value="selectedValue.value"
					:readonly="readonly"/>
		</div>
		<div
				:class="['list-group', 'z-combo-list', {'z-hidden': !listIsVisible}]">
			<a
					href="#" v-for="item in filteredItems"
					:class="[
					'list-group-item',
					'list-group-item-action',
					'z-list-item',
					{'list-group-item-primary':item.value === selectedValue.value}]"
					@click="setValue(item, $event)"
					:data-value="item.value">{{item.description}}</a>
		</div>
	</div>
</template>

<style scoped>
	/* Resets box-shadow margin from focus */
	.z-input {
		cursor: default;
		padding-right: 16px;
	}

	.z-combo-list {
		position: absolute;
		display: block;
		z-index: 999999;
		overflow-y: auto;
		border-radius: 5px 5px 5px 5px;
		-moz-border-radius: 5px 5px 5px 5px;
		-webkit-border-radius: 5px 5px 5px 5px;
		border: 1px solid rgba(217, 217, 217, 1);
	}

	.z-hidden {
		visibility: hidden;
	}

	.z-list-item {
		font-size: 0.9rem;
		height: 2rem;
		border-width: 1px 0px 1px 0px;
		line-height: 2rem;
		padding: 0 0 0 0.85em;
	}

	.z-dropdown-arrow {
		position: relative;
		overflow: visible;
		display: block;
	}

	.z-dropdown-arrow:after {
		position: absolute;
		top: 50%;
		width: 5px;
		height: 5px;
		right: 0.5em;
		/* arrow */
		content: "";
		border-top: 0.3em solid;
		border-right: 0.3em solid transparent;
		border-left: 0.3em solid transparent;
	}

	/* Bootstrap, removes gray color from disabled textfield */
	.form-control[readonly] {
		background-color: #fff;
	}

	.isLoading {
		background-color: #f2f2f2;
	}

	.loader-position {
		position: absolute;
		right: 0px;
	}

	.hidden:after {
		visibility: hidden;
	}

</style>

<script>
	var idCount = 0;
	const Value = require('./Value.js');
	import FilterMixin from "./filter.js";

	export default {

		name: 'bootstrapselect',

		props: {
			"pName": String,
			"pLabel": String,
			"pItems": Array,
			"pListMaxHeight": {
				type: Number,
				default: 250
			}
		},

		mixins: [FilterMixin],

		created: function () {
			/**
			 * Listner added to "window.document".
			 * Shared var between methods.
			 * @type {function}
			 */
			this._clickHandler;
			/**
			 * Shared var that keeps the event that fired the toogle method.
			 * @type {MouseEvent}
			 */
			this._showClickEvent;
		},

		data: function () {
			return {
				id: null,
				selectedValue: null,
				valueDescription: '',
				listIsVisible: false,
				readonly: true,
				hasFocus: false,
				filteredItems: [],
				items: []
			}
		},

		beforeMount: function () {
			this.id = `${this.pName}-${idCount}`;
			idCount++;
			this.selectedValue = new Value();
			this.filteredItems = this.items;
			this.loadInitialItems();
		},

		mounted: function () {

		},

		methods: {
			loadInitialItems: function() {
				this.pItems.forEach((val, i) => {
					this.items.push(new Value(val));
				});
			},

			toggle: function (evt) {
				this._showClickEvent = evt;
				console.log(this.listIsVisible);
				if (!this.listIsVisible) {
					this.showList();
				} else if (!this.hasFocus) {
					this.hide();
				}
			},

			showList: function () {
				console.log('showList');
				this._clickHandler = this.hide.bind(this);
				document.addEventListener('click', this._clickHandler);
				$(this.$el).children('.list-group')
					.css('width', $(this.$el)[0].offsetWidth);
				this.filteredItems = this.items;
				this.hasFocus = true;
				this.listIsVisible = true;

				this.$nextTick(this.updateHeight.bind(this));
			},

			hide: function (evt) {
				if (this._showClickEvent !== evt && this.listIsVisible) {
					console.log('hide');
					document.removeEventListener('click', this._clickHandler);
					this.hasFocus = false;
					this.listIsVisible = false;
					this.valueDescription = this.selectedValue.description;
				}
			},

			updateHeight: function () {
				var list = $(this.$el).children('.list-group');
				list.css('height', "");
				if (list[0].offsetHeight > this.pListMaxHeight) {
					list.css('height', this.pListMaxHeight + 'px');
				}
			},


			setValue: function (value, evt) {
				console.log(value);
				this.selectedValue = value;
				this.hide(evt);
			}
		}
	}
</script>