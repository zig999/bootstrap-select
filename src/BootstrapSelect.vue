<template>
	<div class="form-group" :id="id">
		<label :for="id+'-input'">{{pLabel}}</label>
		<div class="z-dropdown-arrow" @click="toggle($event)">
			<input
					:class="['form-control', 'form-control-sm', 'z-input', 'z-transitions', {'z-focus':hasFocus}]"
					:id="id+'-input'"
					v-model="valueDescription"
					:data-selected-value="selectedValue.value"
					:readonly="readonly"/>
		</div>
		<div
				:class="['list-group', 'z-combo-list', 'z-transitions', {'z-hidden': !listIsVisible}]">
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
		/*Transition*/
		-webkit-box-shadow: 0px 0px 0px 0px rgba(76, 171, 255, 0);
		-moz-box-shadow: 0px 0px 0px 0px rgba(76, 171, 255, 0);
		box-shadow: 0px 0px 0px 0px rgba(76, 171, 255, 0);
	}

	/* Adds blue margin using box-shadow to the input field */
	.z-focus {
		/*Transition*/
		-webkit-box-shadow: 0px 0px 0px 2px rgba(76, 171, 255, 1);
		-moz-box-shadow: 0px 0px 0px 2px rgba(76, 171, 255, 1);
		box-shadow: 0px 0px 0px 2px rgba(76, 171, 255, 1);
	}

	.z-transitions {
		transition-delay: 0s;
		transition-duration: 0.25s;;
		transition-property: box-shadow, -webkit-box-shadow, -moz-box-shadow, opacity, visibility;
		transition-timing-function: ease-in-out;
	}

	.z-combo-list {
		position: absolute;
		display: block;
		z-index: 999999;
		margin-top: 2px;

		/*Transition*/
		visibility: visible;
		opacity: 1;
		overflow-y: auto;

		-webkit-box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.2);
		-moz-box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.2);
		box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.2);

		border-radius: 10px 10px 10px 10px;
		-moz-border-radius: 10px 10px 10px 10px;
		-webkit-border-radius: 10px 10px 10px 10px;

		border: 1px solid rgba(217, 217, 217, 1);
	}

	.z-hidden {
		/*Transition*/
		visibility: hidden;
		opacity: 0;
	}

	.z-list-item {
		height: 30px;
		border-width: 1px 0px 1px 0px;
		line-height: 30px;
		padding: 0 0 0 0.85em;
	}

	.z-dropdown-arrow {
		position: relative;
		text-align: right;
		overflow: visible;
		display: block;
	}

	.z-dropdown-arrow:after {
		position: absolute;
		top: 50%;
		margin-left: -1.255em;
		margin-top: -0.125em;
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

</style>

<style>
	label {
		margin-bottom: .005rem;
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