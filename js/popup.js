/**
 * @file This JavaScript file provides some methods for showing popups.
 * The following ID's and HTML-Classes are used by this JavaScript file:
 * <ul>
 *	<li><i>#popup</i><br>(has CSS [as an alternativ you can use the class <i>.popup</i> for predefined pupups or dialogs])</li>
 *	<li><i>#popup-button</i><br>(has CSS [as an alternativ you can use the class <i>.popup-button</i> for predefined pupups or dialogs])</li>
 *	<li><i>#popup-button:hover</i><br>(has CSS [the alternativ class of id #popup-button has the same hover CSS])</li>
 *	<li><i>#popup-text</i><br>(has CSS [as an alternativ you can use the class <i>.popup-text</i> for predefined pupups or dialogs])</li>
 *	<li><i>.yes-action</i></li>
 *	<li><i>.ok-action</i></li>
 *	<li><i>.no-action</i></li>
 *	<li><i>.cancel-action</i></li>
 * </ul>
 * <br><br>For correct usability you need the popup.css file.
 * <br>This library is licensed under MIT. For more information look at the
 * license file in the git repository.
 * 
 * 
 * @author Patrick Siegmund
 * @version 1.3.1
 */

/*
 * State of popup visibility.
 */
var _isPopupShown = false;

/*
 * Position of the scrollbar at the web page.
 */
var _scrollPosition = 0;

/*
 * Popup should scroll with the page.
 */
var _scrollWithWindow = false;

/*
 * ID of the popup html element.
 */
var _idOfPopup = null;

/*
 * Actual action listener for popup buttons.
 */
var _actActionListener = null;

/*
 * The popup object.
 */
var _popup = null;

/**
 * A class with constants for action types. You need this types for dialogs.
 * This class has a global variable: {@link ActionType}
 *
 * @author Patrick Siegmund
 */
class ActionTypeClass{
	constructor(){
		/**
		 * ActionType for standard popups.<br>
		 *	return value ok = <b>0</b>
		 * @type {int}
		 */
		this.OK_POPUP = 0;
		/**
		 * ActionType for dialogs with yes and no button.<br>
		 *	return value yes = <b>0</b><br>
		 *	return value no = <b>1</b>
		 * @type {int}
		 */
		this.YES_NO_DIALOG = 1;
		/** 
		 * ActionType for dialogs with yes, no and cancel button.<br>
		 *	return value yes = <b>0</b><br>
		 *	return value no = <b>1</b><br>
		 *	return value cancel = <b>2</b>
		 * @type {int}
		 */
		this.YES_NO_CANCEL_DIALOG = 2;
		/**
		 * ActionType for dialogs with ok and cancel button.<br>
		 *	return value ok = <b>0</b><br>
		 *	return value cancel = <b>1</b>
		 * @type {int}
		 */
		this.OK_CANCEL_DIALOG = 3;
		
		/**
		 * Gets the name of the action type by the action type value.
		 *
		 * @param {int} actionType
		 * 				The action type value.
		 * @return {String} The name of the action type.
		 * @throws {Error} No such type defined!
		 */
		this.getName = function(actionType){
			switch (actionType){
				case this.OK_POPUP:
					return 'OK_POPUP';
				case this.YES_NO_DIALOG:
					return 'YES_NO_DIALOG';
				case this.YES_NO_CANCEL_DIALOG:
					return 'YES_NO_CANCEL_DIALOG';
				case this.OK_CANCEL_DIALOG:
					return 'OK_CANCEL_DIALOG';
				default:
					throw new Error("No such type defined! ActionType: " + actionType);
			}
		}
	}
}

/**
 * Object of class {@link ActionTypeClass}.
 */
var ActionType = new ActionTypeClass();

/**
 * Holds the last used action type (see {@link ActionTypeClass}) and the return value of dialogs and popups.
 * This class has a global variable: {@link DialogReturn}
 *
 * @author Patrick Siegmund
 */
class DialogReturnClass{
	/**
	 * Creates a dialog return.
	 *
	 * @param {int} actionType
	 *				The action type value of the last dialog or popup.
	 * @param {int} returnValue
	 *				The return value of the last dialog or popup.
	 */
	constructor(actionType, returnValue){
		var _actionType = actionType;
		var _returnValue = returnValue;
		
		/**
		 * Gets the action type of the last dialog.
		 *
		 * @return {int} The last action type.
		 */
		this.getActionType = function(){
			return _actionType;
		}
		
		/**
		 * Gets the return value of the last dialog.
		 *
		 * @return {int} The last return value.
		 */
		this.getReturnValue = function(){
			return _returnValue;
		}
	}
}

/**
 * Object of class {@link DialogReturnClass}.
 */
var DialogReturn = new DialogReturnClass(ActionType.OK_POPUP, 0);



/**
 * A class with constants for button texts.
 * This class has a global variable: {@link ButtonText}
 *
 * @author Patrick Siegmund
 */
class ButtonTextClass{
	constructor(){
		/**
		 * Standard button text <b>'Ok'</b>.
		 * @type {String}
		 * 
		 */
		this.OK_BUTTON_TEXT = 'Ok';
		/**
		 * Standard button text <b>'Ja'</b>.
		 * @type {String}
		 */
		this.YES_BUTTON_TEXT = 'Ja';
		/**
		 * Standard button text <b>'Nein'</b>.
		 * @type {String}
		 */
		this.NO_BUTTON_TEXT = 'Nein';
		/**
		 * Standard button text <b>'Abbrechen'</b>.
		 * @type {String}
		 */
		this.CANCEL_BUTTON_TEXT = 'Abbrechen';
	}
}

/**
 * Object of class {@link ButtonTextClass}.
 */
var ButtonText = new ButtonTextClass();


/*
 * A class with standard actions for buttons on standrad popups / dialogs.
 *
 * @author Patrick Siegmund
 */
class StandardActionCommandClass{
	constructor(){
		/*
		 * Hides the standard popup (used as standard action; private use only!).
		 */
		this.hidePopup = function(){
			hidePopupFunction();
		}
		
		/*
		 * A dialog action for a yes button on actionType ActionType.YES_NO_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>0</b>
		 */
		this.yesNoDialog_yesAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_DIALOG, 0);
			hidePopupFunction();
			_actActionListener();
		}

		/*
		 * A dialog action for the no button on actionType ActionType.YES_NO_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>1</b>
		 */
		this.yesNoDialog_noAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_DIALOG, 1);
			hidePopupFunction();
			_actActionListener();
		}

		/*
		 * A dialog action for the yes button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>0</b>
		 */
		this.yesNoCancelDialog_yesAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_CANCEL_DIALOG, 0);
			hidePopupFunction();
			_actActionListener();
		}

		/*
		 * A dialog action for the no button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>1</b>
		 */
		this.yesNoCancelDialog_noAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_CANCEL_DIALOG, 1);
			hidePopupFunction();
			_actActionListener();
		}

		/*
		 * A dialog action for the cancel button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>2</b>
		 */
		this.yesNoCancelDialog_cancelAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_CANCEL_DIALOG, 2);
			hidePopupFunction();
			_actActionListener();
		}

		/*
		 * A dialog action for the ok button on actionType ActionType.OK_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>0</b>
		 */
		this.okCancelDialog_okAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.OK_CANCEL_DIALOG, 0);
			hidePopupFunction();
			_actActionListener();
		}

		/*
		 * A dialog action for the cancel button on actionType ActionType.OK_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>1</b>
		 */
		this.okCancelDialog_cancelAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.OK_CANCEL_DIALOG, 1);
			hidePopupFunction();
			_actActionListener();
		}
		
		function hidePopupFunction(){
			_popup.hide();
			_popup.children().remove();
			_popup.css('bottom', '');
			_popup.css('right', '');
			_isPopupShown = false;
			_scrollWithWindow = false;
			_idOfPopup = null;
		}
	}
}

/*
 * Object of class {@link StandardActionCommandClass}.
 */
var _StandardActionCommand = new StandardActionCommandClass();

$(document).ready(function(){
	$(window).resize(_relocatePopup);
	$(window).scroll(function(){
		_scrollPosition = $(window).scrollTop();
		
		if (_scrollWithWindow == true && _idOfPopup != null && _popup != null)
			_relocatePopup(_idOfPopup);
	});
});

/**
 * This class represents a popup / dialog. With its methods you are able to show the user
 * standard popups or dialogs.
 */
class PopupClass{
	constructor(){
		_popup = $('<div></div>').attr('id', 'popup').appendTo('body');
		_popup.hide();
		
		/**
		 * Show standard popup.
		 *
		 * @param {String} title
		 *			The Title of the popup. Can be null.
		 * @param {String} text
		 *			The text wich should be shown in the popup.
		 * @param {boolean} scroll
		 *			True, if the popup should be in the middle of the screen by scrolling.
		 * @param {String} actionText
		 *			The text of the action (button title). DEFAULT = 'Ok'
		 * @param {function} action
		 *			The action that will processed by click on the button
		 *			of the popup (onClick function). DEFAULT = _StandardActionCommand.hidePopup()
		 */
		this.showPopup = function(title, text, scroll, actionText, action){
			if (_isPopupShown == true)
				_StandardActionCommand.hidePopup();
			
			if (typeof actionText === "undefined")
				actionText = ButtonText.OK_BUTTON_TEXT;
			if (typeof action === "undefined")
				action = _StandardActionCommand.hidePopup;

			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			
			if (typeof title !== "undefined" && title != null && title != '')
				_popup.append('<h3 id="popup-title">' + title + '</h3>');
			_popup.append('<p id="popup-text">' + text + '</p>');
			_popup.append('<button id="popup-button">' + actionText + '</button>');
			_popup.find('#popup-button').click(action);
			
			_isPopupShown = true;
			_idOfPopup = _popup;
			DialogReturn = new DialogReturnClass(ActionType.OK_POPUP, 0);
			_popup.show();
			
			var bottom = windowHeight / 2 - _popup.height() / 2 - _scrollPosition;
			var right = windowWidth / 2 - _popup.width() / 2;
			_popup.css('bottom', bottom);
			_popup.css('right', right);
			
			_scrollWithWindow = scroll;
		}

		/**
		 * Show a standard dialog. The actionType decides wich dialog options are aviable.
		 *
		 * @param {String} title
		 *			The Title of the dialog. Can be null.
		 * @param {String} text
		 *			The text wich should be shown in the dialog.
		 * @param {boolean} scroll
		 *			Boolean - true, if the dialog should be in the middle of
		 *			of the screen by scrolling.
		 * @param {ActionTypeClass} actionType
		 *			The type of dialog. You can choose the following types:
		 *				<br>- {@link ActionType}.YES_NO_DIALOG
		 *				<br>- {@link ActionType}.YES_NO_CANCEL_DIALOG
		 *				<br>- {@link ActionType}.OK_CANCEL_DIALOG
		 *				<br>- {@link ActionType}.OK_POPUP
		 *			<br>The default dialog is the {@link ActionType}.OK_POPUP. The return value of the standard popup is always <b>0</b>.
		 * @param {function} actionListener
		 *			A function wich is processed after hiding the dialog.
		 */
		this.showDialogPopup = function(title, text, scroll, actionType, actionListener){
			if (_isPopupShown == true)
				_StandardActionCommand.hidePopup();

			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			
			if (typeof title !== "undefined" && title != null && title != '')
				_popup.append('<h3 id="popup-title">' + title + '</h3>');
			_popup.append('<p id="popup-text">' + text + '</p>');
			switch (actionType){
				case ActionType.YES_NO_DIALOG:
					_popup.append('<button id="popup-button" class="yes-action">' + ButtonText.YES_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.yes-action').click(_StandardActionCommand.yesNoDialog_yesAction);
					_popup.append('<button id="popup-button" class="no-action">' + ButtonText.NO_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.no-action').click(_StandardActionCommand.yesNoDialog_noAction);
					break;
				case ActionType.YES_NO_CANCEL_DIALOG:
					_popup.append('<button id="popup-button" class="yes-action">' + ButtonText.YES_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.yes-action').click(_StandardActionCommand.yesNoCancelDialog_yesAction);
					_popup.append('<button id="popup-button" class="no-action">' + ButtonText.NO_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.no-action').click(_StandardActionCommand.yesNoCancelDialog_noAction);
					_popup.append('<button id="popup-button" class="cancel-action">' + ButtonText.CANCEL_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.cancel-action').click(_StandardActionCommand.yesNoCancelDialog_cancelAction);
					break;
				case ActionType.OK_CANCEL_DIALOG:
					_popup.append('<button id="popup-button" class="ok-action">' + ButtonText.OK_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.ok-action').click(_StandardActionCommand.okCancelDialog_okAction);
					_popup.append('<button id="popup-button" class="cancel-action">' + ButtonText.CANCEL_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.cancel-action').click(_StandardActionCommand.okCancelDialog_cancelAction);
					break;
				default:
					_popup.append('<button id="popup-button" class="ok-action">' + ButtonText.OK_BUTTON_TEXT + '</button>');
					_popup.find('#popup-button.ok-action').click(_StandardActionCommand.hidePopup);
					DialogReturn = new DialogReturnClass(ActionType.OK_POPUP, 0);
					if (typeof actionListener !== "undefined" && actionListener != null)
						_popup.find('#popup-button.ok-action').click(actionListener);
			}
			
			_isPopupShown = true;
			_idOfPopup = _popup;
			_actActionListener = actionListener;
			_popup.show();
			
			var bottom = windowHeight / 2 - _popup.height() / 2 - _scrollPosition;
			var right = windowWidth / 2 - _popup.width() / 2;
			_popup.css('bottom', bottom);
			_popup.css('right', right);
			
			_scrollWithWindow = scroll;
		}
	}
}

/**
 * This class represents a popup / dialog. With its methods you are able to show the user
 * in your html document predefined popups or dialogs.<br><br>
 * If you want that your popup / dialog resizes and relocate by the browser window, use the global
 * function {@link relocatePreparedPopup} at <b>$(window).resize(<i>call_of_relocatePreparedPopup</i>);</b>.
 */
class PreparedPopupClass{
	/**
	 *	Creates an object of this class.
	 *
	 * @param {String} id
	 *			Id of a html element. This element is your popup.
	 */
	constructor(id){
		var _id = id;
		$(_id).hide();
		
		/**
		 * Shows a prepared popup. A prepared popup is an user created HTML element.
		 * <br><br>For auto-resize/relocate use the method {@link relocatePreparedPopup} at the
		 * resize event of the window.
		 * <br><br>For hiding the popup add the methdod hidePreparedPopup of this class to
		 * the buttons of your HTML element.
		 */
		this.showPreparedPopup = function(){
			if (_isPopupShown == true)
				hidePreparedPopup(_id);

			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			
			_isPopupShown = true;
			_idOfPopup = _id;
			$(_id).show();
			
			var bottom = windowHeight / 2 - $(_id).height() / 2 - _scrollPosition;
			var right = windowWidth / 2 - $(_id).width() / 2;
			$(_id).css('bottom', bottom);
			$(_id).css('right', right);
			
			_scrollWithWindow = scroll;
		}

		/**
		 * Hides a prepared popup.
		 * A prepared popup is an user created HTML element.
		 */
		this.hidePreparedPopup = function(){
			$(_id).hide();
			$(_id).css('bottom', '');
			$(_id).css('right', '');
			_isPopupShown = false;
			_scrollWithWindow = false;
			_idOfPopup = null;
		}
	}
}

/*
 * The auto-resize/relocate method for standard popup. The user don't
 * need this method. Its set at the resize event of window automatically.
 */
function _relocatePopup(){
	if (_isPopupShown == true){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var bottom = windowHeight / 2 - _popup.height() / 2 - _scrollPosition;
		var right = windowWidth / 2 - _popup.width() / 2;
		
		_popup.css('bottom', bottom);
		_popup.css('right', right);
	}
}

/**
 * The auto-resize/relocate method for prepared popups.
 * A prepared popup is an user created HTML element. (See {@link PreparedPopupClass})
 *
 * @param {String} id
 *			The id of the prepared popup element.
 */
function relocatePreparedPopup(id){
	if (_isPopupShown == true){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var bottom = windowHeight / 2 - $(id).height() / 2 - _scrollPosition;
		var right = windowWidth / 2 - $(id).width() / 2;
		
		$(id).css('bottom', bottom);
		$(id).css('right', right);
	}
}