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

    constructor() {
        super();

        console.log("ListviewViewController constructor called");;
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        console.log("ListviewViewController oncreate called");

        // Initialisiere die Liste mit den vorgegebenen Items
        this.items = [
            new entities.MediaItem("m1", "https://i.pinimg.com/originals/e9/e3/29/e9e329c92bccbb2f298e63ec7874ada7.jpg"),
            new entities.MediaItem("m2", "https://image.essen-und-trinken.de/11920128/t/XZ/v8/w960/r1/-/rotkaeppchen-kuchen-40e5b57ac898a2c63e49659b7b166773-fjt2014031001-jpg--7723-.jpg"),
            new entities.MediaItem("m3", "https://www.simply-yummy.de/files/styles/tec_frontend_large/public/images/recipes/froschkuchen.jpeg")
        ];

        // Liste sofort initialisieren mit den vorgegebenen Items
        this.initialiseListview(this.items);

        // Event Listener für neuen Media-Item hinzufügen
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = (() => {
            const newItem = new entities.MediaItem("m new", "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/A8971B73-0803-4B25-9979-4A1DAA8BE620/Derivates/567fdd64-76f6-470e-ba00-ac69d3e3feab.jpg");
            this.items.push(newItem); // Neues Item zur Liste hinzufügen
            this.addToListview(newItem); // Neues Item zur Ansicht hinzufügen
        });

        // CRUD-Operationen lesen und die Liste initialisieren
        try {
            const itemsFromCrud = await this.crudops.readAll();
            this.items = itemsFromCrud; // Ersetze die initialen Items durch die aus der CRUD-Operation
            this.initialiseListview(this.items); // Liste mit den Items aus der CRUD-Operation initialisieren
        } catch (error) {
            console.error("Error reading items:", error);
        }

        // Superklasse aufrufen, wenn die Erstellung abgeschlossen ist
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
    /*
    bindListItemView(listviewid, itemview, itemobj) {
        itemview.root.getElementsByTagName("img")[0].src = itemobj.src;
        itemview.root.getElementsByTagName("h2")[0].textContent = itemobj.title+itemobj._id;
        itemview.root.getElementsByTagName("h3")[0].textContent = itemobj.added;
    }
+/
    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        alert("Element " + itemobj.title + itemobj._id + " wurde ausgewählt!");
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
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

    deleteItem(item) {
        this.crudops.delete(item._id).then(() => {
            this.removeFromListview(item._id);
        });
    }
    editItem(item) {
        item.title = (item.title + item.title);
        this.crudops.update(item._id,item).then(() => {
            this.updateInListview(item._id,item);
        });
    }

}