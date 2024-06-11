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
        console.log("ListviewViewController oncreate called");

        // Initialisiere die Liste mit den vorgegebenen Items
        //this.items = [
           // new entities.MediaItem("m1", "https://i.pinimg.com/originals/e9/e3/29/e9e329c92bccbb2f298e63ec7874ada7.jpg"),
         //   new entities.MediaItem("m2", "https://image.essen-und-trinken.de/11920128/t/XZ/v8/w960/r1/-/rotkaeppchen-kuchen-40e5b57ac898a2c63e49659b7b166773-fjt2014031001-jpg--7723-.jpg"),
          //  new entities.MediaItem("m3", "https://www.simply-yummy.de/files/styles/tec_frontend_large/public/images/recipes/froschkuchen.jpeg")
       // ];

        // Liste sofort initialisieren mit den vorgegebenen Items
       // this.initialiseListview(this.items);

        // Event Listener für neuen Media-Item hinzufügen
        this.addNewMediaItemElement = this.root.querySelector("#addNewMediaItem"); // Hier wird einfach im Html der Plusbutton in eine Variable gesteckt
        this.addNewMediaItemElement.onclick = (() => {
           // const newItem = new entities.MediaItem("m new", "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/A8971B73-0803-4B25-9979-4A1DAA8BE620/Derivates/567fdd64-76f6-470e-ba00-ac69d3e3feab.jpg");
            //this.items.push(newItem); // Neues Item zur Liste hinzufügen
            //this.addToListview(newItem); // Neues Item zur Ansicht hinzufügen

            // this.createNewItem() // War bis heute noch aktiv (11.6.2024)
            // siehe Aufzeichnung vom 28.5.2024 - 1:20:13 für weitere Einstellungen
            this.nextView("myapp-mediaEditview");

        });

        this.root.querySelector("footer .mwf-img-refresh").onclick = () => {
            // alert("switchCRUD operations. cuurent operations / currentCRUDScope are: " + this.application.currentCRUDScope);
            if (this.application.currentCRUDScope === "local") {
                this.application.switchCRUD("remote");
            }
            else {
                this.application.switchCRUD("local");
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

    createNewItem() {
        var newItem = new entities.MediaItem("", 'https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/A8971B73-0803-4B25-9979-4A1DAA8BE620/Derivates/567fdd64-76f6-470e-ba00-ac69d3e3feab.jpg');

        this.showDialog("mediaItemDialog",{
            item: newItem,
            actionBindings: {
                submitForm: ((event) => {
                    event.original.preventDefault();
                    newItem.create().then(() => {
                        this.addToListview(newItem);
                    });
                    this.hideDialog();
                })
            }
        });
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
        this.nextView("mediaReadview",{item: itemobj});
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