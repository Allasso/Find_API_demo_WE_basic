/*
 *    Copyright (C) 2018  Kevin Jones
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**********************
 * DEMONSTRATION OF browser.find API
 *
 * BASIC DEMONSTRATION
 *
 * Demonstrates browser.find.find, browser.find.highlightResults, and
 * browser.find.removeHighlighting.
 *
 * Click on the browserAction toolbar button to run demo (See below).
 *
 * browser.find.find
 *
 * This will search for a phrase and store the results internally, which can then
 *   be used later by browser.find.highlightResults.  Note that these results
 *   persist until the next browser.find.find operation, and thus can be used
 *   over again repeatedly by browser.find.highlightResults without running another
 *   search, eg, to highlight different matches for the same search.
 *
 *   It will also (optionally) return the following:
 *
 *   `rangeData` from which can be extrapolated the DOM nodes wherein matches
 *   were found.  Useful to extensions for finding surrounding text of the matches
 *   which can give a summary display of results in context in a separate UI.
 *   Demonstration of the use for this is not inclded in this demo, but can be
 *   found in the advanced demo - Find_API_demo_WE_advanced.
 *
 *   `rectData` which provides cartesian coordinates of all the text matched in
 *   the search, relative to the top-level document[1].  Useful to extensions for
 *   providing custom highlighting of results.
 *   Demonstration of the use for this is not inclded in this demo, but can be
 *   found in the advanced demo - Find_API_demo_WE_advanced.
 *
 * browser.find.highlightResults
 *
 * This will use internal Find highlighting mechanism (nsISelectionController)
 *   to highlight results found in previous browser.find.find.  Note that this
 *   can be run independently of browser.find.find, as long as a search has
 *   been made and there are results in the cache.  Note that because this uses
 *   the native highlighting mechanism, its use may override Find operations
 *   using the Findbar, and vice versa.
 *
 * browser.find.removeHighlighting
 *
 * This will use internal Find highlighting mechanism (nsISelectionController)
 *   to remove all highlighting made by a previous highlight operation.
 *
 **********************/

/**
 * Utility:
 */
let globalT0;

function findResults() {
  /**
   * Call browser.find.find:
   * Documentation from browser.find.find API:
   *
   ** browser.find.find
   ** Searches document and its frames for a given queryphrase and stores all found
   ** Range objects in an array accessible by other browser.find methods.
   **
   ** @param {string} queryphrase - The string to search for.
   ** @param {object} params optional - may contain any of the following properties,
   **   all of which are optional:
   **   {integer} tabId - Tab to query.  Defaults to the active tab.
   **   {boolean} caseSensitive - Highlight only ranges with case sensitive match.
   **   {boolean} entireWord - Highlight only ranges that match entire word.
   **   {boolean} includeRangeData - Whether to return range data.
   **   {boolean} includeRectData - Whether to return rectangle data.
   **
   ** @returns a promise that will be resolved when search is completed, that includes:
   **   {integer} count - number of results found.
   **   {array} rangeData (if opted) - serialized representation of ranges found.
   **   {array} rectData (if opted) - rect data of ranges found.
   *
   * Simply running browser.find.find(queryphrase) will perform a basic search
   *  and cache results in the API.
   */
globalT0 = Date.now();
  dump("WE : findResults : queryphrase : "+queryphrase+"\n");
  var result = browser.find.find(queryphrase, { tabId: null,
                                                  caseSensitive: caseSensitive,
                                                  entireWord: entireWord,
                                                  includeRangeData: includeRangeData,
                                                  includeRectData: includeRectData });

  result.then(function(data) {
    dump("WE : background.js : count : "+data.count+"\n");

    if (includeRangeData) {
      dump("WE : background.js : rangeData : "+data.rangeData+"\n");
    }
    if (includeRectData) {
      dump("WE : background.js : rectData : "+data.rectData+"\n");
    }
  });
}

function highlightResults() {
  dump("WE : highlightResults : rangeIndex : "+rangeIndex+"\n");
  /*
   * Call browser.find.highlightResults:
   * Documentation from browser.find.highlightResults API:
   *
   ** browser.find.highlightResults
   ** Highlights range(s) found in previous browser.find.find.
   **
   ** @param {object} params optional - may contain any of the following properties:
   **   all of which are optional:
   **   {integer} rangeIndex - Found range to be highlighted. Default highlights all ranges.
   **   {integer} tabId - Tab to highlight.  Defaults to the active tab.
   **   {boolean} noScroll - Don't scroll to highlighted item.
   **
   ** Throws exception if index supplied was out of range, or
   **  there were no search results to highlight.
   *
   * Simply running browser.find.highlightResults() with no args will highlight
   *  all results from the last search.
   */
  var result = browser.find.highlightResults({ rangeIndex: rangeIndex,
                                               tabId: null,
                                               noScroll: noScroll });
  result.then(function(data) {
  });
}

function clearHighlighting() {
  /**
   * call browser.find.removeHighlighting - removes all highlighting.
   */
  browser.find.removeHighlighting();
}

/**********************
/**********************
/**********************
 * DEMO - globally set params for browser.find methods here for convenience.
 *
 * Click on the browserAction toolbar button to run demo.
 */

/**
 * Global parameters, see below:
 */
let queryphrase;
let caseSensitive;
let entireWord;
let includeRangeData;
let includeRectData;
let noScroll;

browser.browserAction.onClicked.addListener(() => {
  // This will run an example sequence of finding results, sequentially highlighting
  // the first, second, then all results found in the search, then clear the highlighting.
  // This assumes that the `queryphrase` value occurs at least twice on the page.
  // IRL, if combining operations one would initiate subsequent operation upon
  // resolving of a promise.
  //
  // Arg0 of highlightResults sets `rangeIndex`.

  /** Initialize parameters: **/

  /** browser.find.find parameters: **/
  queryphrase = "the";
  caseSensitive = undefined;
  entireWord = undefined;
  includeRangeData = true;  /* If true, return range data from which can be
                                   extrapolated the DOM nodes wherein matches were found.
                                   Useful for extracting text surrounding matches.[1] */
  includeRectData = true;  /* If true, return rectangle data from which can be
                                  extracted the cartesian coordinates of matches.
                                  Useful for custom highlighting of matches.[1] */

  /* [1] Examples of how to utilize range data and rect data for more enhanced
   * presentation and functionality of search results can be found in the more
   * advanced WebExtension demo version.
   */

  /** browser.find.highlightResults parameters: **/
  rangeIndex = undefined;  /* Index of the match to highlight if `!highlightAll`,
                              and the match to scroll to if `!noScroll` */
  noScroll = undefined;  /* Default will scroll the match at `rangeIndex` into view.
                            If this is true, no scrolling occurs. */

  /** Run sequence: **/

  // Find all occurances of `queryphrase` and cache them in the API.
  findResults();
  setTimeout(() => {

    // highlight the first occurance.
    rangeIndex = 0;
    highlightResults();

    setTimeout(() => {

      // highlight the second occurance.
      rangeIndex = 99;
      highlightResults();

      setTimeout(() => {

        // highlight all occurances.
        rangeIndex = undefined;
        highlightResults();
        setTimeout(() => {

          // clear all highlighting.
          clearHighlighting();

        }, 4000);
      }, 1000);
    }, 1000);
  }, 1000);
});
