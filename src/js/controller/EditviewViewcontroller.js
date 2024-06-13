/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";
import {checkNoUnwrappedItemOptionPairs} from "@babel/core/lib/config/validation/options";

export default class EditviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    // TODO-REPEATED: declare custom instance attributes for this controller

    /*
     * for any view: initialise the view
     */
    async oncreate() {
        this.mediaItem = this.args?.item || new entities.MediaItem();

        // instantiate the template for the view
        this.viewProxy = this.bindElement("myapp-mediaEditviewTemplate", {item: this.mediaItem}, this.root).viewProxy;

        // TODO: do databinding, set listeners, initialise the view
        this.editviewForm = this.root.querySelector("main form");

        this.editviewForm.srcimg.onchange = () => {
            const fileObjecturl = URL.createObjectURL(this.editviewForm.srcimg.files[0]);
            this.mediaItem.src = fileObjecturl;
            this.viewProxy.update({item: this.mediaItem});
        }

        this.editviewForm.onsubmit = () => {
            if (this.editviewForm.srcimg.files[0]) {
                // 1. upload the selected image to the server
                const requestObj = new XMLHttpRequest();
                const baseUrl = "http://127.0.0.1:7077";
                const uploadUrl = baseUrl + "/api/upload";

                requestObj.open("POST",uploadUrl);
                const dataToBeUploaded = new FormData();
                dataToBeUploaded.append("imgdata",this.editviewForm.srcimg.files[0]);
                requestObj.send(dataToBeUploaded); // send-Methode genauer anschauen zur Rücksprache, allgemein xmlhttp-request- wie reagiert server, wie kann man damit umgehen
                // 2. obtain the URL for the referencing the uploaded image on the server
                requestObj.onload = () => {
                    if (requestObj.status === 200) {
                        alert("responseText: " + requestObj.responseText);
                        const responseData = JSON.parse(requestObj.responseText);
                        console.log("responseData: ", responseData);
                        const uploadedImgRelativeUrl = responseData.data.imgdata;
                        // 3. use the URL as src attribute if the media item to be created or updated
                        this.mediaItem.src = baseUrl + "/" + uploadedImgRelativeUrl;
                        // 4. create or update the mediaItem
                        this.createOrUpdateMediaItem();
                    }
                    else {
                        alert("Error status on upload!: " + requestObj.status);
                    }
                }


            }
            else {
                this.createOrUpdateMediaItem();
            }


            // return false to prevent form data submission by the browser
            return false;
        }

        // call the superclass once creation is done
        super.oncreate();
    }

    createOrUpdateMediaItem() {
        // handle the submit
        // const selectedSrc = this.editviewForm.src.value;
        // const selectedTitle = this.editviewForm.title.value;

        // const newMediaItem = new entities.MediaItem(selectedTitle,selectedSrc);
        // console.log("newMediaItem: " + newMediaItem, newMediaItem.added, newMediaItem.addedDateString);
        alert("this.mediaItem: " + this.mediaItem.src + "; " + this.mediaItem.title);

        if (this.mediaItem.created) {
            this.mediaItem.update().then(() => {
                this.previousView({item: this.mediaItem}, "itemUpdated");
            });
        }
        else {
            this.mediaItem.create().then(() => {
                this.previousView({item: this.mediaItem}, "itemCreated");
            });
        }
    }

    // async onresume() {
    //    this.editviewForm.src.value = this.mediaItem.src;
    //    this.editviewForm.title.value = this.mediaItem.title;

    //    this.root.querySelector("header h1").textContent = this.mediaItem.title;

    //    super.onresume();
    //}


    constructor() {
        super();

        console.log("EditviewViewController()");
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
        // TODO: implement how attributes of itemobj shall be displayed in itemview
    }

    /*
     * for views with listviews: react to the selection of a listitem
     * TODO: delete if no listview is used or if item selection is specified by targetview/targetaction
     */
    onListItemSelected(itemobj, listviewid) {
        // TODO: implement how selection of itemobj shall be handled
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