<template>
	<div v-click-outside="outside" class="custom">
		<b-form-group>
			<label v-if="title" for="data" @click="setDisabled">{{ title }}</label>
			<div class="dropdown-form" v-if="options.length" :class="{ disable: disabled }">
				<ul>
					<li v-for="(item, index) in options">
						<span @click="getItem(item, index)" :class="{ active: item.isActive }">{{ item.text }}</span>
						<Ul v-if="item[childName].length">
							<li v-for="(child, index) in item[childName]" @click="getItem(child, index)" :class="{ active: child.isActive }"> 
								{{ child.text }}
							</li>
						</Ul>
					</li>
				</ul>
			</div>
		</b-form-group>
	</div>
</template>
<script>
	export default {
		/// Событие нажатия вне основного элемента .custom (не моя функция)
		directives: {
			'click-outside': {
				bind(el, binding, vNode) {
					// Provided expression must evaluate to a function.
					/* eslint-disable */
					if (typeof binding.value !== 'function') {
						const compName = vNode.context.name;
						let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`; // eslint-disable-line
						if (compName) {
							warn += `Found in component '${compName}'`;
						}
					}
					/* eslint-enable */
					// Define Handler and cache it on the element
					const bubble = binding.modifiers.bubble;
					const handler = (e) => {
					if (bubble || (!el.contains(e.target) && el !== e.target)) {
						binding.value(e);
					}
				};
				el.__vueClickOutside__ = handler;
					// add Event Listeners
					document.addEventListener('click', handler);
				},

				unbind(el, binding) {
					// Remove Event Listeners
					document.removeEventListener('click', el.__vueClickOutside__);
					el.__vueClickOutside__ = null;
				}
			}
		},
		props: {
			/**
			 * @name records
			 * @param {String} Данные
			 * @return {String} Result value
			*/
			records: {
				type: Array,
				default: () => []
			},
			/**
			 * @name selected
			 * @param {String} Заголовок карточки
			 * @return {String} Result value
			*/
			selected: {
				type: Object,
				default: () => {}
			},
			/**
			 * @name parentName
			 * @param {String} Наименование родительского элемента
			 * @return {String} Result value
			*/
			parentName: {
				type: String,
				default: 'parentId'
			},
			/**
			 * @name childName
			 * @param {String} Наименование дочернего элемента
			 * @return {String} Result value
			*/
			childName: {
				type: String,
				default: 'children'
			}
		},
		data() {
			return {
				/**
				 * @name title
				 * @param {String}
				 * @return {String} Result value
				*/
				title: 'Выберите значение...',
				/**
				 * @name disabled
				 * @param {Boolea}
				 * @return {Boolea} Result value
				*/
				disabled: true,
				/**
				 * @name item
				 * @param {Object} Выбранный элемент
				 * @return {Object} Result value
				*/
				item: {},
				/**
				 * @name options
				 * @param {Array} Данные
				 * @return {Array} Result value
				*/
				options: []
			}
		},
		methods: {
			/*
			 * @name outside()
			 * @description Обработка нажатие вне основного элемента .custom
			*/
			outside() {
				this.disabled = true;
			},
			/*
			 * @name setDisabled()
			 * @description Открытие/скрытие списка
			*/
			setDisabled() {
				this.disabled = !this.disabled;
			},
			/*
			 * @name getParent()
			 * @description Получение родительского элемента
			 * @param <Number> parentId ID родителя
			 * @return <Object> {}
			*/
			getParent(parentId) {
				return _.find(this.options, item => item.value === parentId);
			},
			/*
			 * @name getItem()
			 * @description Обработка выбора элемента
			 * @param <Object> obj Элемент
			 * @param <Object> index Индекс элемента
			*/
			getItem(obj, index) {
				this.title = obj.text;
				this.disabled = true;
				this.item.text = obj.text;
				this.item.value = obj.value;
				this.setActive(obj, index);
				this.$emit('getItem', this.prepareItem(obj));
			},
			/*
			 * @name prepareItem()
			 * @description Подготовка элемента, перед передачей на страницу
			 * @param <Object> obj Элемент
			 * @return <Object> {}
			*/
			prepareItem(obj) {
				let children = [];
				let parent = null;
				let tmp = {};
				tmp.value = obj.value;
				tmp.text = obj.text;
				tmp._item = obj;

				if (obj[this.childName]) {
					children = _.get(obj, this.childName, []);
				}
				if (obj[this.parentName]) {
					parent = obj[this.parentName];
				}

				tmp[this.parentName] = parent;
				tmp[this.childName] = children;

				return tmp;
			},
			/*
			 * @name setActive()
			 * @description Выделение цветом выбранного элемента
			 * @param <Object> item Элемент
			 * @param <Number> index Индекс
			 * @return <Boolean> true
			*/
			setActive(item, index) {
				this.unsetActive();
				if (item[this.childName]) {
					this.options[index].isActive = true;
					return true;
				}
				if (item.parentId) {
					let parent = this.getParent(item.parentId);
					parent[this.childName][index].isActive = true;
					return true;
				}
			},
			/*
			 * @name unsetActive()
			 * @description Отмена выделения элемента
			*/
			unsetActive() {
				_.forEach(this.options, record => {
					delete record.isActive;
					if (record[this.childName]) {
						_.forEach(record[this.childName], item => {
							delete item.isActive;
						});
					}
				});
			},
			/*
			 * @name getIndex()
			 * @description Получение индекса выбранного элемента
			 * @param <Object> records Массив значенй
			 * @param <Number> value ID выбранного элемента
			 * @return <Number> index
			*/
			getIndex(records, value) {
				let index = null;
				_.forEach(records, (record, id) => {
					if (record.value === value) index = id;
				});
				return index;
			},
			/*
			 * @name checkRecords()
			 * @description Проверка полученных данных из страницы
			 * @return <Boolean> true/false
			*/
			checkRecords() {
				if (this.selected[this.parentName] && this.getParent(this.selected[this.parentName])) return true;
				if (this.selected[this.childName] && this.getIndex(this.records, this.selected.value)) return true;
				// if (!_.isEmpty(this.records)) return true;
				return false;
			}
		},
		created() {
			this.options = _.cloneDeep(this.records);
			if (this.checkRecords()) this.item = _.cloneDeep(this.selected);
		},
		watch: {
			item() {
				this.title = this.item.text;
				if (this.item.parentId) {
					let parent = this.getParent(this.item.parentId);
					let index = this.getIndex(parent[this.childName], this.item.value);
					let parentIndex = this.getIndex(this.options, this.item.parentId);
					this.options[parentIndex][this.childName][index].isActive = true;
				}
				if (this.item[this.childName]) {
					this.options[this.getIndex(this.options, this.item.value)].isActive = true;
				}
			}
		}
	};
</script>
<style scoped lang="scss">
* {
	list-style: none;
	text-decoration: none;
}
.custom {
	position: relative;
	label {
		display: block;
		border: 1px solid #ccc;
		padding: 10px 10px;
		margin: 0;
		&:hover {
			box-shadow: 3px -2px 2px rgba(74, 144, 217, .6);
			cursor: pointer;
		}
	}

	.disable {
		display: none;
	}

	.dropdown-form {
		background: #fff;
		border: 1px solid #ccc;
		box-shadow: inset 3px -2px 2px #F7F7F7;
		height: 350px;
		width: 100%;
		overflow: hidden;
		overflow-y: scroll;
		position: absolute;
		z-index: 25;
		margin-bottom: 250px;
		&>ul {
			margin: 0;
			padding: 0;
			
			&>li {
				&>span {
					display: block;
					padding: 5px 20px;
					&:hover {
						background: #5b9bde;
						cursor: pointer;
					}

					&.active {
						background: #4a90d9;
					}
				}
				&>ul {
					margin: 0;
					padding: 0;
					li {
						padding: 5px 40px;

						&:hover {
							background: #5b9bde;
							cursor: pointer;
						}

						&.active {
							background: #4a90d9;
						}
					}
				}
			}
		}
	}
}
</style>