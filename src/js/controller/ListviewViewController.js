/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {


    // instance attributes set by mwf after instantiation
    args;
    root;

    // custom instance attributes for this controller
    items;
    addNewMediaItemElement;

    constructor() {
        super();
        console.log("ListviewViewController constructor called");;
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        console.log("ListviewViewController oncreate called");
        // TODO: do databinding, set listeners, initialise the view
        this.items = [
            new
            entities.MediaItem("m1","https://i.pinimg.com/originals/e9/e3/29/e9e329c92bccbb2f298e63ec7874ada7.jpg"),
            new
            entities.MediaItem("m2","https://i.pinimg.com/originals/e9/e3/29/e9e329c92bccbb2f298e63ec7874ada7.jpg"),
            new
            entities.MediaItem("m3","https://i.pinimg.com/originals/e9/e3/29/e9e329c92bccbb2f298e63ec7874ada7.jpg")
        ];

        this.initialiseListview(this.items);

        // call the superclass once creation is done
        super.oncreate();
        console.log("ListviewViewController oncreate completed");

    }



    /*
     * for views that initiate transitions to other views
     * NOTE: return false if the view shall not be returned to, e.g. because we immediately want to display its previous view. Otherwise, do not return anything.
     */
    async onReturnFromNextView(nextviewid, returnValue, returnStatus) {
        // TODO: check from which view, and possibly with which status, we are returning, and handle returnValue accordingly
    }

    /*
     * for views with listviews: bind a list item to an item view
     * TODO: delete if no listview is used or if databinding uses ractive templates
     */
    bindListItemView(listviewid, itemview, itemobj) {
        itemview.root.getElementsByTagName("img")[0].src = itemobj.src;
        itemview.root.getElementsByTagName("h2")[0].textContent = itemobj.title;
        itemview.root.getElementsByTagName("h3")[0].textContent = itemobj.added;
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        alert("Element " + itemobj.title + " wurde ausgewählt!");
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        // TODO: implement how selection of the option menuitemview for itemobj shall be handled
    }

    /*
     * for views with dialogs
     * TODO: delete if no dialogs are used or if generic controller for dialogs is employed
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

}
