/**
 * @file This JavaScript file provides some methods for showing popups.
 * For the standard popups you need an empty <b>div</b> or <b>span</b> element with the ID <b>popup</b> as direct child of <b>body</b>.
 * The following ID's and HTML-Classes are used by this JavaScript file:
 * <ul>
 *	<li>#popup</li>
 *	<li>#popup-button</li>
 *	<li>#popup-button:hover</li>
 *	<li>#popup-text</li>
 *	<li>.yes-action</li>
 *	<li>.ok-action</li>
 *	<li>.no-action</li>
 *	<li>.cancel-action</li>
 * </ul>
 * <br><br>For correct usability you need the popup.css file.
 * <br>This library is licensed under the MIT.
 * 
 * 
 * @author Patrick Siegmund
 * @version 1.2.0
 */

var _isPopupShown = false;
var _scrollPosition = 0;
var _scrollWithWindow = false;
var _idOfPopup = null;
var _actActionListener = null;

/**
 * A class with varants for action types. You need this types for dialogs.
 * This class has an global variable: {@link ActionType}
 *
 * @author Patrick Siegmund
 */
class ActionTypeClass{
	constructor(){
		/**
		 * ActionType for standard popups.<br>
		 *	return value ok = <b>0</b>
		 */
		this.OK_POPUP = 0;
		/**
		 * ActionType for dialogs with yes and no button.<br>
		 *	return value yes = <b>0</b><br>
		 *	return value no = <b>1</b>
		 */
		this.YES_NO_DIALOG = 1;
		/** 
		 * ActionType for dialogs with yes, no and cancel button.<br>
		 *	return value yes = <b>0</b><br>
		 *	return value no = <b>1</b><br>
		 *	return value cancel = <b>2</b>
		 */
		this.YES_NO_CANCEL_DIALOG = 2;
		/**
		 * ActionType for dialogs with ok and cancel button.<br>
		 *	return value ok = <b>0</b><br>
		 *	return value cancel = <b>1</b>
		 */
		this.OK_CANCEL_DIALOG = 3;
		
		/**
		 * Gets the name of the action type by the action type value.
		 *
		 * @param {int} actionType
		 * 				The action type value.
		 * @return {String} The name of the action type.
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
					return 'Error: No such type defined!';
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
 * This class has an global variable: {@link DialogReturn}
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
 * A class with varants for buttons texts.
 * This class has an global variable: {@link ButtonText}
 *
 * @author Patrick Siegmund
 */
class ButtonTextClass{
	constructor(){
		/**
		 * Standard button text <b>'Ok'</b>.
		 */
		this.OK_BUTTON_TEXT = 'Ok';
		 /**
		 * Standard button text <b>'Ja'</b>.
		 */
		this.YES_BUTTON_TEXT = 'Ja';
		 /**
		 * Standard button text <b>'Nein'</b>.
		 */
		this.NO_BUTTON_TEXT = 'Nein';
		 /**
		 * Standard button text <b>'Abbrechen'</b>.
		 */
		this.CANCEL_BUTTON_TEXT = 'Abbrechen';
	}
}

/**
 * Object of class {@link ButtonTextClass}.
 */
var ButtonText = new ButtonTextClass();


/**
 * A class with standard actions for button on popups.
 *
 * @author Patrick Siegmund
 */
class StandardActionCommandClass{
	constructor(){
		/**
		 * Hides the standard popup (used as standard action; private use only!).
		 */
		this.hidePopup = function(){
			hidePopupFunction();
		}
		
		/**
		 * A dialog action for a yes button on actionType ActionType.YES_NO_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>0</b>
		 */
		this.yesNoDialog_yesAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_DIALOG, 0);
			hidePopupFunction();
			_actActionListener();
		}

		/**
		 * A dialog action for the no button on actionType ActionType.YES_NO_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>1</b>
		 */
		this.yesNoDialog_noAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_DIALOG, 1);
			hidePopupFunction();
			_actActionListener();
		}

		/**
		 * A dialog action for the yes button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>0</b>
		 */
		this.yesNoCancelDialog_yesAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_CANCEL_DIALOG, 0);
			hidePopupFunction();
			_actActionListener();
		}

		/**
		 * A dialog action for the no button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>1</b>
		 */
		this.yesNoCancelDialog_noAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_CANCEL_DIALOG, 1);
			hidePopupFunction();
			_actActionListener();
		}

		/**
		 * A dialog action for the cancel button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>2</b>
		 */
		this.yesNoCancelDialog_cancelAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.YES_NO_CANCEL_DIALOG, 2);
			hidePopupFunction();
			_actActionListener();
		}

		/**
		 * A dialog action for the ok button on actionType ActionType.OK_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>0</b>
		 */
		this.okCancelDialog_okAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.OK_CANCEL_DIALOG, 0);
			hidePopupFunction();
			_actActionListener();
		}

		/**
		 * A dialog action for the cancel button on actionType ActionType.OK_CANCEL_DIALOG. (private use only!)<br>
		 *	dialog return value = <b>1</b>
		 */
		this.okCancelDialog_cancelAction = function(){
			DialogReturn = new DialogReturnClass(ActionType.OK_CANCEL_DIALOG, 1);
			hidePopupFunction();
			_actActionListener();
		}
		
		function hidePopupFunction(){
			$('#popup').hide();
			$('#popup').children().remove();
			$('#popup').css('bottom', '');
			$('#popup').css('right', '');
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

/**
 * Hide standard popup and set auto-resize/relocate by window-rezize.
 */
$(document).ready(function(){
	$(window).resize(relocatePopup);
	$(window).scroll(function(){
		_scrollPosition = $(window).scrollTop();
		
		if (_scrollWithWindow == true && _idOfPopup != null)
			relocatePopup(_idOfPopup);
	});
	$('#popup').hide();
});

/**
 * Show standard popup.
 *
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
function showPopup(text, scroll, actionText, action){
	if (_isPopupShown == true)
		_StandardActionCommand.hidePopup();
	
	if (typeof actionText === "undefined")
		actionText = ButtonText.OK_BUTTON_TEXT;
	if (typeof action === "undefined")
		action = _StandardActionCommand.hidePopup;

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$('#popup').append('<p id="popup-text">' + text + '</p>');
	$('#popup').append('<button id="popup-button">' + actionText + '</button>');
	$('#popup').find('#popup-button').click(action);
	
	_isPopupShown = true;
	_idOfPopup = '#popup';
	DialogReturn = new DialogReturnClass(ActionType.OK_POPUP, 0);
	$('#popup').show();
	
	var bottom = windowHeight / 2 - $('#popup').height() / 2 - _scrollPosition;
	var right = windowWidth / 2 - $('#popup').width() / 2;
	$('#popup').css('bottom', bottom);
	$('#popup').css('right', right);
	
	_scrollWithWindow = scroll;
}

/**
 * Show a standard dialog. The actionType decides wich dialog options are aviable.
 *
 * @param {String} text
 *			The text wich should be shown in the popup.
 * @param {boolean} scroll
 *			Boolean - true, if the popup should be in the middle of
 *			of the screen by scrolling.
 * @param {ActionTypeClass} actionType
 *			The type of dialog. You can choose the following types:
 *				<br>- {@link ActionType}.YES_NO_DIALOG
 *				<br>- {@link ActionType}.YES_NO_CANCEL_DIALOG
 *				<br>- {@link ActionType}.OK_CANCEL_DIALOG
 *			<br>The default dialog is the standard popup. The return value of the standard popup is always <b>0</b>.
 * @param {function} actionListener
 *			A function wich is processed after hiding the dialog.
 */
function showDialogPopup(text, scroll, actionType, actionListener){
	if (_isPopupShown == true)
		_StandardActionCommand.hidePopup();
	
	if (typeof actionText === "undefined")
		actionText = 'Ok';

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$('#popup').append('<p id="popup-text">' + text + '</p>');
	switch (actionType){
		case ActionType.YES_NO_DIALOG:
			$('#popup').append('<button id="popup-button" class="yes-action">' + ButtonText.YES_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.yes-action').click(_StandardActionCommand.yesNoDialog_yesAction);
			$('#popup').append('<button id="popup-button" class="no-action">' + ButtonText.NO_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.no-action').click(_StandardActionCommand.yesNoDialog_noAction);
			break;
		case ActionType.YES_NO_CANCEL_DIALOG:
			$('#popup').append('<button id="popup-button" class="yes-action">' + ButtonText.YES_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.yes-action').click(_StandardActionCommand.yesNoCancelDialog_yesAction);
			$('#popup').append('<button id="popup-button" class="no-action">' + ButtonText.NO_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.no-action').click(_StandardActionCommand.yesNoCancelDialog_noAction);
			$('#popup').append('<button id="popup-button" class="cancel-action">' + ButtonText.CANCEL_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.cancel-action').click(_StandardActionCommand.yesNoCancelDialog_cancelAction);
			break;
		case ActionType.OK_CANCEL_DIALOG:
			$('#popup').append('<button id="popup-button" class="ok-action">' + ButtonText.OK_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.ok-action').click(_StandardActionCommand.okCancelDialog_okAction);
			$('#popup').append('<button id="popup-button" class="cancel-action">' + ButtonText.CANCEL_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.cancel-action').click(_StandardActionCommand.okCancelDialog_cancelAction);
			break;
		default:
			$('#popup').append('<button id="popup-button" class="ok-action">' + ButtonText.OK_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.ok-action').click(_StandardActionCommand.hidePopup);
			DialogReturn = new DialogReturnClass(ActionType.OK_POPUP, 0);
			if (typeof actionListener !== "undefined" && actionListener != null)
				$('#popup').find('#popup-button.ok-action').click(actionListener);
	}
	
	_isPopupShown = true;
	_idOfPopup = '#popup';
	_actActionListener = actionListener;
	$('#popup').show();
	
	var bottom = windowHeight / 2 - $('#popup').height() / 2 - _scrollPosition;
	var right = windowWidth / 2 - $('#popup').width() / 2;
	$('#popup').css('bottom', bottom);
	$('#popup').css('right', right);
	
	_scrollWithWindow = scroll;
}

/**
 * Shows a prepared popup. A prepared popup is an user created HTML element.
 * For auto-resize/relocate use the method relocatePreparedPopup(id) at the
 * resize event of the window.
 *
 * @param {String} id
 *			The id of the prepared popup element.
 */
function showPreparedPopup(id){
	if (_isPopupShown == true)
		hidePreparedPopup(id);

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	_isPopupShown = true;
	_idOfPopup = id;
	$(id).show();
	
	var bottom = windowHeight / 2 - $(id).height() / 2 - _scrollPosition;
	var right = windowWidth / 2 - $(id).width() / 2;
	$(id).css('bottom', bottom);
	$(id).css('right', right);
	
	_scrollWithWindow = scroll;
}

/**
 * Hides a prepared popup.
 * A prepared popup is an user created HTML element.
 *
 * @param {String} id
 *			The id of the prepared popup element.
 */
function hidePreparedPopup(id){
	$(id).hide();
	$(id).css('bottom', '');
	$(id).css('right', '');
	_isPopupShown = false;
	_scrollWithWindow = false;
	_idOfPopup = null;
}

/**
 * The auto-resize/relocate method for standard popup. The user don't
 * need this method. Its set at the resize event of window automatically.
 */
function relocatePopup(){
	if (_isPopupShown == true){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var bottom = windowHeight / 2 - $('#popup').height() / 2 - _scrollPosition;
		var right = windowWidth / 2 - $('#popup').width() / 2;
		
		$('#popup').css('bottom', bottom);
		$('#popup').css('right', right);
	}
}

/**
 * The auto-resize/relocate method for prepared popups.
 * A prepared popup is an user created HTML element.
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