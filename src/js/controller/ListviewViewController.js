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
        console.log("ListviewViewController constructor called");

        // Initialisiere CRUD-Operationen hier
        this.crudops = entities.MediaItem;
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        console.log("ListviewViewController oncreate called");

        // Überprüfen, ob CRUD-Operationen initialisiert sind
        if (!this.crudops) {
            console.error("CRUD operations are not defined.");
            return;
        }

        // Initiale Einträge
        const initialItems = [
            new entities.MediaItem("m1", "https://i.pinimg.com/originals/e9/e3/29/e9e329c92bccbb2f298e63ec7874ada7.jpg", "image/jpeg"),
            new entities.MediaItem("m2", "https://image.essen-und-trinken.de/11920128/t/XZ/v8/w960/r1/-/rotkaeppchen-kuchen-40e5b57ac898a2c63e49659b7b166773-fjt2014031001-jpg--7723-.jpg", "image/jpeg"),
            new entities.MediaItem("m3", "https://www.simply-yummy.de/files/styles/tec_frontend_large/public/images/recipes/froschkuchen.jpeg", "image/jpeg")
        ];

        // CRUD-Operationen lesen und die Liste initialisieren
        try {
            let itemsFromCrud = await this.crudops.readAll();

            // Wenn die Datenbank leer ist, füge initiale Einträge hinzu
            if (itemsFromCrud.length === 0) {
                for (const item of initialItems) {
                    await this.crudops.create(item);
                }
                itemsFromCrud = await this.crudops.readAll();
            }

            this.items = itemsFromCrud;
            this.initialiseListview(this.items);

        } catch (error) {
            console.error("Error reading items:", error);
        }

        // Event Listener für neuen Media-Item hinzufügen
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        if (this.addNewMediaItemElement) {
            this.addNewMediaItemElement.onclick = (() => {
                const newItem = new entities.MediaItem("m new", "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/A8971B73-0803-4B25-9979-4A1DAA8BE620/Derivates/567fdd64-76f6-470e-ba00-ac69d3e3feab.jpg", "image/jpeg");
                this.items.push(newItem); // Neues Item zur Liste hinzufügen
                this.addToListview(newItem); // Neues Item zur Ansicht hinzufügen
                this.crudops.create(newItem); // Neues Item zur Datenbank hinzufügen
            });
        } else {
            console.error("Element #addNewMediaItem not found.");
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
     */
    bindListItemView(listviewid, itemview, itemobj) {
        itemview.root.getElementsByTagName("img")[0].src = itemobj.src;
        itemview.root.getElementsByTagName("h2")[0].textContent = itemobj.title + itemobj._id;
        itemview.root.getElementsByTagName("h3")[0].textContent = itemobj.added;
    }

    /*
     * for views with listviews: react to the selection of a listitem
     */
    onListItemSelected(itemobj, listviewid) {
        alert("Element " + itemobj.title + itemobj._id + " wurde ausgewählt!");
    }

    /*
     * for views with listviews: react to the selection of a listitem menu option
     */
    onListItemMenuItemSelected(menuitemview, itemobj, listview) {
        super.onListItemMenuItemSelected(menuitemview, itemobj, listview);
    }

    /*
     * for views with dialogs
     */
    bindDialog(dialogid, dialogview, dialogdataobj) {
        // call the supertype function
        super.bindDialog(dialogid, dialogview, dialogdataobj);

        // TODO: implement action bindings for dialog, accessing dialog.root
    }

    deleteItem(item) {
        console.log("Deleting item:", item);
        this.crudops.delete(item._id).then(() => {
            console.log("Item deleted successfully");
            this.removeFromListview(item._id);
        }).catch(error => {
            console.error("Error deleting item:", error);
        });
    }

    editItem(item) {
        console.log("Editing item:", item);
        item.title = item.title + item.title;
        this.crudops.update(item._id, item).then(() => {
            console.log("Item updated successfully");
            this.updateInListview(item._id, item);
        }).catch(error => {
            console.error("Error updating item:", error);
        });
    }
}
