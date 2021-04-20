/**********************************************************
 * Object Pool
 * Pooled Object must implement the following methods:-
 * create
 * reset
 * isActive
 */
export default {
    collection: null,

    create (pooledObject) {
        const obj = Object.create(this);
        obj.collection = [];
        obj.pooledObject = pooledObject;
        return obj;
    },

    add (){
        let obj = null;

        if(this.isObjectReady()){
            obj = this.collection.shift();
            obj.reset.apply(obj, arguments);
        }

        if(!obj){
            obj = this.pooledObject.create.apply(this.pooledObject, arguments);
        }

        this.collection.push(obj);
    },

    isObjectReady(){
        return this.collection[0] && !this.collection[0].isActive();
    },

    clean () {
        // Remove all unused objects from the pool except for 1
        let i = 0
        for (; i < this.collection.length; i++) {
            if(this.collection[i].isActive()){
                break;
            }
        }

        if(i > 1){
            this.collection.splice(0, i - 1);
        }
    }
};
