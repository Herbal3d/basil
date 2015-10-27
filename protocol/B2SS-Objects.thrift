/*
 * Basil <=> Space Server Objects.
 * 
 * There are two parts to this protocol:
 *     Dealing with updates of objects
 *     Dealing with management of object descriptions.
 * Objects are tracked by an ID (some string). A SS sends messages
 * to Basil updating the object in the view. These updates include
 * position, rotation, and path.
 * To display the object, Basil must manage a cache of representations
 * of the object. 
 */

service B2SS-Objects {
}
