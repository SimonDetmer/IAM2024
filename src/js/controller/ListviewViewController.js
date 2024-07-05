/**
 * @author Jörn Kreutel
 */
import {GenericCRUDImplLocal, mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ListviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;

    constructor() {
        super()
        console.log("ListviewViewController constructor called");
    }

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        if (this.application.currentCRUDScope === "local") {
            this.root.querySelector("footer #status").innerHTML = 'local'
        }
        else {
            this.root.querySelector("footer #status").innerHTML = 'remote'
        }

        // Event Listener für neuen Media-Item hinzufügen
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem");
        this.addNewMediaItemElement.onclick = (() => {
            this.nextView("myapp-mediaEditview");
        });

        this.root.querySelector("footer .mwf-img-refresh").onclick = () => {
            if (this.application.currentCRUDScope === "local") {
                this.application.switchCRUD("remote");
                this.root.querySelector("footer #status").innerHTML = 'remote'
            }
            else {
                this.application.switchCRUD("local");
                this.root.querySelector("footer #status").innerHTML = 'local'
            }
            entities.MediaItem.readAll().then(items => this.initialiseListview(items));
        }
   
        // CRUD-Operationen lesen und die Liste initialisieren
        try {
            const itemsFromCrud = await entities.MediaItem.readAll();
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
    async onReturnFromNextView(nextviewid,returnValue,returnStatus)
    {

        if (nextviewid == "mediaReadview" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
        else if (returnStatus === "itemCreated" && returnValue.item) {
            this.addToListview(returnValue.item);
        }
        else if (returnStatus === "itemUpdated" && returnValue.item) {
            this.updateInListview(returnValue.item._id,returnValue.item);
        }
        else if (returnStatus === "itemDeleted" && returnValue && returnValue.deletedItem) {
            this.removeFromListview(returnValue.deletedItem._id);
        }
    }

    deleteItem(item) {
        item.delete(() => {
            this.removeFromListview(item._id);
        });
    }

    editItem(item) {
        this.showDialog("mediaItemDialog", {
            item: item,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    item.update().then(() => {
                        this.updateInListview(item._id, item);
                    });
                }),
                deleteItem: ((event) => {
                    this.deleteItem(item);
                    this.hideDialog();
                })
            }
        });
    }

}