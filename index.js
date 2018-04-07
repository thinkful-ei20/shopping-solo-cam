'use strict';
/* global $ */

const STORE = {
  items:[ 
    {name: 'apples', checked: false, isEditing: false},
    {name: 'oranges', checked: false, isEditing: false},
    {name: 'milk', checked: true, isEditing: false},
    {name: 'bread', checked: false, isEditing: false}
  ],
  showOnlyUncrossedItems: false, 
  searchTerm: '',
};

function generateItemElement(item, itemIndex, template) {
  let itemHtml = `<li class="js-item-index-element" data-item-index="${itemIndex}">`;
  if(item.isEditing === true) {
    itemHtml += `<input name="itemTitle" class="js-item-textbox" type="text" autofocus="autofocus" value="${item.name}">`;
  } else {
    itemHtml += `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`;
  }
  itemHtml += 
  `<div class="shopping-item-controls">
    <button class="shopping-item-toggle js-item-toggle">
      <span class="button-label">check</span>
    </button>
    <button class="shopping-item-delete js-item-delete">
      <span class="button-label">delete</span>
     </button>
    </div>
   </li>`;
  
  return itemHtml;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  // filtered items = STORE.items filtered over to return a new array of items
  // the new array contains the items that are NOT checked
  let filteredItems;
  if (STORE.showOnlyUncrossedItems) {
    filteredItems = STORE.items.filter(function(item){
      return item.checked === false;
    }); 
  } else {
    filteredItems = STORE.items;
  }

  // 
  if (STORE.searchTerm !== '') {
    filteredItems = filteredItems.filter(function(item) {
      return item.name.toLowerCase().includes(STORE.searchTerm.toLowerCase());
    });     
  }

  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, isEditing: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// Handles the checkbox key/value in STORE
function handleFilterCheckBoxChecked() {
  // Reference the checkbox input, add event listener on change event
  $('#checkBox').change(event => {
    // When checkbox is checked
    // Set STORE.showOnlyUncrossedITems to the opposite
    STORE.showOnlyUncrossedItems = !STORE.showOnlyUncrossedItems;
    renderShoppingList();
  }); 
}

function handleSearchTermChanged() {
  // keyup renders every keystroke
  $('#searchTerm').on('keyup', event => {
    STORE.searchTerm = $('#searchTerm').val();
    console.log(STORE.searchTerm);
    renderShoppingList();
  });
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleTitleEdit() {
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items[itemIndex].isEditing = true;
    renderShoppingList();
  });
}

function handleTitleUneditBlur() {
  $('.js-shopping-list').on('blur', '.js-item-textbox', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    STORE.items[itemIndex].isEditing = false;
    STORE.items[itemIndex].name = $(event.currentTarget).val();
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterCheckBoxChecked();
  handleSearchTermChanged();
  handleTitleEdit();
  handleTitleUneditBlur();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);