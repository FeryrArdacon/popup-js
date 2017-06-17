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
 * @version 1.1.1
 */

var isPopupShown = false;
var scrollPosition = 0;
var scrollWithWindow = false;
var idOfPopup = null;

/**
 * Return value of dialogs (See {@link ActionTypeClass} for more information about the possible values).
 */
var dialogReturnValue = 0;
var actActionListener = null;

/**
 * A class with varants for action types. You need this types for dialogs.
 *
 * @author Patrick Siegmund
 */
class ActionTypeClass{
	constructor(){
		/**
		 * ActionType for dialogs with yes and no button.<br>
		 *	return value yes = <b>0</b><br>
		 *	return value no = <b>1</b>
		 */
		this.YES_NO_DIALOG = 0;
		/** 
		 * ActionType for dialogs with yes, no and cancel button.<br>
		 *	return value yes = <b>0</b><br>
		 *	return value no = <b>1</b><br>
		 *	return value cancel = <b>2</b>
		 */
		this.YES_NO_CANCEL_DIALOG = 1;
		/**
		 * ActionType for dialogs with ok and cancel button.<br>
		 *	return value ok = <b>0</b><br>
		 *	return value cancel = <b>1</b>
		 */
		this.OK_CANCEL_DIALOG = 2;
	}
}

/**
 * A class with varants for buttons texts.
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
		 *	dialogReturnValue = <b>0</b>
		 */
		this.yesNoDialog_yesAction = function(){
			dialogReturnValue = 0;
			hidePopupFunction();
			actActionListener();
		}

		/**
		 * A dialog action for the no button on actionType ActionType.YES_NO_DIALOG. (private use only!)<br>
		 *	dialogReturnValue = <b>1</b>
		 */
		this.yesNoDialog_noAction = function(){
			dialogReturnValue = 1;
			hidePopupFunction();
			actActionListener();
		}

		/**
		 * A dialog action for the yes button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialogReturnValue = <b>0</b>
		 */
		this.yesNoCancelDialog_yesAction = function(){
			dialogReturnValue = 0;
			hidePopupFunction();
			actActionListener();
		}

		/**
		 * A dialog action for the no button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialogReturnValue = <b>1</b>
		 */
		this.yesNoCancelDialog_noAction = function(){
			dialogReturnValue = 1;
			hidePopupFunction();
			actActionListener();
		}

		/**
		 * A dialog action for the cancel button on actionType ActionType.YES_NO_CANCEL_DIALOG. (private use only!)<br>
		 *	dialogReturnValue = <b>2</b>
		 */
		this.yesNoCancelDialog_cancelAction = function(){
			dialogReturnValue = 2;
			hidePopupFunction();
			actActionListener();
		}

		/**
		 * A dialog action for the ok button on actionType ActionType.OK_CANCEL_DIALOG. (private use only!)<br>
		 *	dialogReturnValue = <b>0</b>
		 */
		this.okCancelDialog_okAction = function(){
			dialogReturnValue = 0;
			hidePopupFunction();
			actActionListener();
		}

		/**
		 * A dialog action for the cancel button on actionType ActionType.OK_CANCEL_DIALOG. (private use only!)<br>
		 *	dialogReturnValue = <b>1</b>
		 */
		this.okCancelDialog_cancelAction = function(){
			dialogReturnValue = 1;
			hidePopupFunction();
			actActionListener();
		}
		
		function hidePopupFunction(){
			$('#popup').hide();
			$('#popup').children().remove();
			$('#popup').css('bottom', '');
			$('#popup').css('right', '');
			isPopupShown = false;
			scrollWithWindow = false;
			idOfPopup = null;
		}
	}
}

/**
 * Object of class ButtonTextClass.
 */
var ButtonText = new ButtonTextClass();
/**
 * Object of class ActionTypeClass.
 */
var ActionType = new ActionTypeClass();
/**
 * Object of class StandardActionCommandClass.
 */
var StandardActionCommand = new StandardActionCommandClass();

/**
 * Hide standard popup and set auto-resize/relocate by window-rezize.
 */
$(document).ready(function(){
	$(window).resize(relocatePopup);
	$(window).scroll(function(){
		scrollPosition = $(window).scrollTop();
		
		if (scrollWithWindow == true && idOfPopup != null)
			relocatePopup(idOfPopup);
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
 *			of the popup (onClick function). DEFAULT = StandardActionCommand.hidePopup()
 */
function showPopup(text, scroll, actionText, action){
	if (isPopupShown == true)
		StandardActionCommand.hidePopup();
	
	if (typeof actionText === "undefined")
		actionText = ButtonText.OK_BUTTON_TEXT;
	if (typeof action === "undefined")
		action = StandardActionCommand.hidePopup;

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$('#popup').append('<p id="popup-text">' + text + '</p>');
	$('#popup').append('<button id="popup-button">' + actionText + '</button>');
	$('#popup').find('#popup-button').click(action);
	
	isPopupShown = true;
	idOfPopup = '#popup';
	dialogReturnValue = 0;
	$('#popup').show();
	
	var bottom = windowHeight / 2 - $('#popup').height() / 2 - scrollPosition;
	var right = windowWidth / 2 - $('#popup').width() / 2;
	$('#popup').css('bottom', bottom);
	$('#popup').css('right', right);
	
	scrollWithWindow = scroll;
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
	if (isPopupShown == true)
		StandardActionCommand.hidePopup();
	
	if (typeof actionText === "undefined")
		actionText = 'Ok';

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$('#popup').append('<p id="popup-text">' + text + '</p>');
	switch (actionType){
		case ActionType.YES_NO_DIALOG:
			$('#popup').append('<button id="popup-button" class="yes-action">' + ButtonText.YES_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.yes-action').click(StandardActionCommand.yesNoDialog_yesAction);
			$('#popup').append('<button id="popup-button" class="no-action">' + ButtonText.NO_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.no-action').click(StandardActionCommand.yesNoDialog_noAction);
			break;
		case ActionType.YES_NO_CANCEL_DIALOG:
			$('#popup').append('<button id="popup-button" class="yes-action">' + ButtonText.YES_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.yes-action').click(StandardActionCommand.yesNoCancelDialog_yesAction);
			$('#popup').append('<button id="popup-button" class="no-action">' + ButtonText.NO_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.no-action').click(StandardActionCommand.yesNoCancelDialog_noAction);
			$('#popup').append('<button id="popup-button" class="cancel-action">' + ButtonText.CANCEL_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.cancel-action').click(StandardActionCommand.yesNoCancelDialog_cancelAction);
			break;
		case ActionType.OK_CANCEL_DIALOG:
			$('#popup').append('<button id="popup-button" class="ok-action">' + ButtonText.OK_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.ok-action').click(StandardActionCommand.okCancelDialog_okAction);
			$('#popup').append('<button id="popup-button" class="cancel-action">' + ButtonText.CANCEL_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.cancel-action').click(StandardActionCommand.okCancelDialog_cancelAction);
			break;
		default:
			$('#popup').append('<button id="popup-button" class="ok-action">' + ButtonText.OK_BUTTON_TEXT + '</button>');
			$('#popup').find('#popup-button.ok-action').click(StandardActionCommand.hidePopup);
			dialogReturnValue = 0;
			if (typeof actionListener !== "undefined" && actionListener != null)
				$('#popup').find('#popup-button.ok-action').click(actionListener);
	}
	
	isPopupShown = true;
	idOfPopup = '#popup';
	actActionListener = actionListener;
	$('#popup').show();
	
	var bottom = windowHeight / 2 - $('#popup').height() / 2 - scrollPosition;
	var right = windowWidth / 2 - $('#popup').width() / 2;
	$('#popup').css('bottom', bottom);
	$('#popup').css('right', right);
	
	scrollWithWindow = scroll;
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
	if (isPopupShown == true)
		hidePreparedPopup(id);

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	isPopupShown = true;
	idOfPopup = id;
	$(id).show();
	
	var bottom = windowHeight / 2 - $(id).height() / 2 - scrollPosition;
	var right = windowWidth / 2 - $(id).width() / 2;
	$(id).css('bottom', bottom);
	$(id).css('right', right);
	
	scrollWithWindow = scroll;
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
	isPopupShown = false;
	scrollWithWindow = false;
	idOfPopup = null;
}

/**
 * The auto-resize/relocate method for standard popup. The user don't
 * need this method. Its set at the resize event of window automatically.
 */
function relocatePopup(){
	if (isPopupShown == true){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var bottom = windowHeight / 2 - $('#popup').height() / 2 - scrollPosition;
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
	if (isPopupShown == true){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		
		var bottom = windowHeight / 2 - $(id).height() / 2 - scrollPosition;
		var right = windowWidth / 2 - $(id).width() / 2;
		
		$(id).css('bottom', bottom);
		$(id).css('right', right);
	}
}