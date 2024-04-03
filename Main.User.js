// ==UserScript==
// @name         WebNovel Chapter Copier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy all the lines in a fanfic chapter on www.webnovel.com with a single click
// @author       ADevNamedDeLL
// @match        https://www.webnovel.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to get the value of a cookie
    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }

    // Function to display the warning message
    function showWarning() {
        const warningMessage = 'If you want to copy a chapter, load that chapter only. If you want to load another chapter, you should open a new tab and load that chapter and only that chapter in the new tab.';
        const warningContainer = document.createElement('div');
        warningContainer.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #ffe6e6; padding: 10px; border: 1px solid #ff3333; border-radius: 5px; z-index: 9999;">
                <span>${warningMessage}</span>
                <button id="close-warning" style="margin-left: 10px; border: none; background-color: transparent; cursor: pointer;">Close</button>
            </div>
        `;
        document.body.appendChild(warningContainer);

        // Add event listener to the close button
        const closeButton = document.getElementById('close-warning');
        closeButton.addEventListener('click', function() {
            warningContainer.remove();
        });
    }

    // Check if the warning should be shown based on the cookie
    const warningCookie = getCookie('webnovel_warning');
    if (!warningCookie) {
        showWarning();
        // Set the cookie to expire after 30 minutes
        setCookie('webnovel_warning', 'shown', 30 / (24 * 60)); // 30 minutes converted to days
    }

    // Function to copy chapter text
    function copyChapterText() {
        const chapterTextElements = document.querySelectorAll('.dib.pr p');
        if (chapterTextElements.length > 0) {
            const chapterText = Array.from(chapterTextElements).map(p => p.textContent).join('\n');
            navigator.clipboard.writeText(chapterText)
                .then(() => alert('Chapter text copied to clipboard'))
                .catch(error => console.error('Unable to copy chapter text: ', error));
        } else {
            alert('Chapter text not found');
        }
    }

    // Create a button for copying chapter text
    const copyChapterButton = document.createElement('button');
    copyChapterButton.textContent = 'Copy Chapter Text';
    copyChapterButton.style.position = 'fixed';
    copyChapterButton.style.top = '80px';
    copyChapterButton.style.right = '70px'; // Adjusted left position
    copyChapterButton.style.zIndex = '9999';
    copyChapterButton.style.padding = '9px';
    copyChapterButton.style.background = '#ff3333';
    copyChapterButton.style.color = 'white';
    copyChapterButton.style.border = 'none';
    copyChapterButton.style.borderRadius = '10px';
    copyChapterButton.style.cursor = 'pointer';
    copyChapterButton.addEventListener('click', copyChapterText);
    document.body.appendChild(copyChapterButton);
})();
