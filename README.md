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
