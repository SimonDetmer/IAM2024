/**
 * @author Jörn Kreutel
 */
import {mwf} from "vfh-iam-mwf-base";
import {mwfUtils} from "vfh-iam-mwf-base";
import * as entities from "../model/MyEntities.js";

export default class ReadviewViewController extends mwf.ViewController {

    // instance attributes set by mwf after instantiation
    args;
    root;
    viewProxy;

    constructor() {
        super();

        console.log("ReadviewViewController()");
    }

    async oncreate() {
        // TODO: do databinding, set listeners, initialise the view
        var mediaItem = this.args.item;
        this.viewProxy = this.bindElement("mediaReadviewTemplate",{item: mediaItem},this.root).viewProxy;
        this.viewProxy.bindAction("deleteItem",(() => {
            mediaItem.delete().then(() => {
                this.previousView({deletedItem:mediaItem});
            })
        }));
        // call the superclass once creation is done
        super.oncreate();
    }

}