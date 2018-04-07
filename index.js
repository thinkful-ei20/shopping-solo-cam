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

// Generate item HTML element templates
function generateItemElement(item, itemIndex, template) {
  // Initialize a variable itemHTML to a template string
  let itemHtml = `<li class="js-item-index-element" data-item-index="${itemIndex}">`;
  // If the item parameter's isEditing key is set to true(It is in editing mode)
  if(item.isEditing === true) {
    // Concatenate an input element
    itemHtml += `<input name="itemTitle" class="js-item-textbox" type="text" autofocus="autofocus" value="${item.name}">`;
  } else {
    // else, if isEditing key is false, concatenate a span element
    itemHtml += `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>`;
  }
  // concatenate the rest of the template 
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
  
  // return the entire template string to be rendered
  return itemHtml;
}

// Generate template strings to be rendered in the DOM
function generateShoppingItemsString(shoppingList) {
  // log what this function is doing in the console
  console.log('Generating shopping list element');
  // initialize items to a new array.
  // Map over the parameter(given array) and return an array of template's to be rendered to the DOM
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  // log the array of templates
  // console.log(items);
  // Return the array, joined together into what is to be the item list in the DOM(formatted for HTML)
  return items.join('');
}

// Render the shopping list in the DOM
function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  // filtered items = STORE.items filtered over to return a new array of items
  // the new array contains the items that are NOT checked

  // Initialize the filteredItems variable
  let filteredItems;
  // if STORE.showOnlyUncrossedItems filter is true
  if (STORE.showOnlyUncrossedItems) {
    // filteredItems is set to a new array of items, using .filter, to return the items that are unchecked(item.checked: false)
    filteredItems = STORE.items.filter(function(item){
      return item.checked === false;
    }); 
  } else {
    // Else, filteredItems is the original array of STORE.items
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

// Add an item to the STORE.items array
function addItemToShoppingList(itemName) {
  // console log which item is being added to the object's array of items
  console.log(`Adding "${itemName}" to shopping list`);
  // The store's item array is pushed the value of a new object, that has 3 properties. A name, whether it's checked(false by default), and a property to be used to determine if it is being edited or not(default false also)
  STORE.items.push({name: itemName, checked: false, isEditing: false});
}

// Handle the event of submitting a new item to the STORE.items array
function handleNewItemSubmit() {
  // Capture the form in the HTML and add an event listener on the submit event
  $('#js-shopping-list-form').submit(function(event) {
    // prevent the form's default behavior
    event.preventDefault();
    // log the function has run, when the event is triggered
    console.log('`handleNewItemSubmit` ran');
    // Initialize a variable newItemName the value of the input's value
    const newItemName = $('.js-shopping-list-entry').val();
    // console.log($('.js-shopping-list-entry').val());

    // Invoke the function which adds the item to the STORE object
    addItemToShoppingList(newItemName);
    // render the DOM
    renderShoppingList();
  });
}

// Get the index of the item in the array of items in the STORE object
function getItemIndexFromElement(item) {
  // Initialize a variable itemIndexString, and give it the value of the HTML element representing the item, captured in jquery.
  // Then traverse to the item's closest <li>(found in the template for the element, pre-rendering)'s attribute's value
  const itemIndexString = $(item).closest('.js-item-index-element').attr('data-item-index');
  // return a parseInt of the string, with the radix of 10. This will return the single integer index of the item, in the array of objects, in the STORE object.items array
  return parseInt(itemIndexString, 10);
}

// Manage the state of the STORE.items' object's checked:true/false
function toggleCheckedForListItem(itemIndex) {
  // Log that the property is being toggled
  console.log('Toggling checked property for item at index ' + itemIndex);
  // the index of the item in STORE is set to its opposite value when the check button is clicked(/toggled).
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

// Handles the checkbox key/value in STORE
function handleFilterCheckBoxChecked() {
  // Reference the checkbox input, add event listener on change event
  $('#checkBox').change(event => {
    // When checkbox is checked(/toggled)
    // Set STORE.showOnlyUncrossedITems to its opposite value
    STORE.showOnlyUncrossedItems = !STORE.showOnlyUncrossedItems;
    // render the shopping list in the DOM to refresh the filtered list
    renderShoppingList();
  }); 
}

// Update the state of the STORE object's searchTerm property value
function handleSearchTermChanged() {
  // Reference the searchTerm input element and add an eventlistener on the keyup event
  // keyup renders every keystroke
  $('#searchTerm').on('keyup', event => {
    // STORE.searchTerm is initialized the value of the input's value
    STORE.searchTerm = $('#searchTerm').val();
    // log the value
    console.log(STORE.searchTerm);
    // render the DOM according to the searchTerm put in the input
    renderShoppingList();
  });
}

// Handle when an item is checked on the list in the DOM
function handleItemCheckClicked() {
  // Capture the <ul> and add a click event on the click(delegated to every item on the list)
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    // log the function runs
    console.log('`handleItemCheckClicked` ran');
    // initialize the variable itemIndex to the value of the getItemIndexFromElement function, passing it the parameter of the currentTarget of the click event.
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // Update the state of the STORE object, passing in the parameter of the itemIndex(the item that has been clicked, which triggered the click event)
    toggleCheckedForListItem(itemIndex);
    // Render the DOM with the updated elements(showing the newly clicked item)
    renderShoppingList();
  });
}

// Manage the state of the STORE.item's objects editing mode property
function handleTitleEdit() {
  // Capture the <ul>, add a click event, delegate the events
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {
    // Initalize a variable to capture the index of the item which triggered the click event
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // Update the state of that items .isEditing property to true(Which means it is currently being edited)
    STORE.items[itemIndex].isEditing = true;
    // Render the DOM so that the item can be edited
    renderShoppingList();
  });
}

// Handed the event of finishing the editing mode
function handleTitleUneditBlur() {
  // Capture the <ul>, add an event listener on the blur event(when an element loses focus. By default, when editing mode begins, the input gains autofocus="autofocus" attribute on the html input element).
  // Delegate the click events to each item in the list
  $('.js-shopping-list').on('blur', '.js-item-textbox', event => {
    // Capture the item that triggered the click event's index
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // Initialize the .isEditing property to false(when the element loses focus)
    STORE.items[itemIndex].isEditing = false;
    // Update the STORE.item(which triggered the event)'s name and initialize it the value of the currentTarget(the input element)'s value
    STORE.items[itemIndex].name = $(event.currentTarget).val();
    // Render the shopping list to update the DOM
    renderShoppingList();
  });
}

// Delete a list item in the STORE object
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

// Delete the item from the DOM
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