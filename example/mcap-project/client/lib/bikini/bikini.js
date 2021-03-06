/*!
 * Project:   The M-Project - Mobile HTML5 Application Framework
 * Copyright: (c) 2014 M-Way Solutions GmbH.
 * Version:   0.5.0
 * Date:      Tue Mar 18 2014 17:16:14
 * License:   http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt
 */

(function (global, Backbone, _, $) {

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * Defines the general namespace
     *
     * @type {Object}
     */
    var Bikini = null;
    if( typeof exports !== 'undefined' ) {
        Bikini = exports;
    } else {
        Bikini = global.Bikini = {};
    }

    /**
     * Version number of current release
     * @type {String}
     */
    Bikini.Version = Bikini.version = '0.5.0';

    /**
     * Empty function to be used when
     * no functionality is needed
     *
     * @type {Function}
     */
    Bikini.f = function() {
    };

    Bikini.create = function( args ) {
        return new this(args);
    };

    Bikini.design = function( obj ) {
        var O = this.extend(obj || {});
        return new O();
    };

    Bikini.extend = Backbone.Model.extend;

    Bikini.isCollection = function( collection ) {
        return Backbone.Collection.prototype.isPrototypeOf(collection);
    };

    Bikini.isModel = function( model ) {
        return Backbone.Model.prototype.isPrototypeOf(model);
    };

    Bikini.isEntity = function( entity ) {
        return Bikini.Entity.prototype.isPrototypeOf(entity);
    };

    /***
     * Data type Constants.
     */
    Bikini.DATA = {
        TYPE: {
            INTEGER: 'integer',

            STRING: 'string',

            TEXT: 'text',

            DATE: 'date',

            BOOLEAN: 'boolean',

            FLOAT: 'float',

            OBJECT: 'object',

            ARRAY: 'array',

            BINARY: 'binary',

            OBJECTID: 'objectid',

            NULL: 'null'
        }
    };

    Bikini.Object = {
        /**
         * The type of this object.
         *
         * @type String
         */
        _type: 'Bikini.Object',

        /**
         * Creates an object based on a passed prototype.
         *
         * @param {Object} proto The prototype of the new object.
         */
        _create: function( proto ) {
            var F = function() {
            };
            F.prototype = proto;
            return new F();
        },

        /**
         * Includes passed properties into a given object.
         *
         * @param {Object} properties The properties to be included into the given object.
         */
        include: function( properties ) {
            for( var prop in properties ) {
                if( this.hasOwnProperty(prop) ) {
                    throw Bikini.Exception.RESERVED_WORD.getException();
                }
                this[prop] = properties[prop];
            }

            return this;
        },

        /**
         * Creates a new class and extends it with all functions of the defined super class
         * The function takes multiple input arguments. Each argument serves as additional
         * super classes - see mixins.
         *
         * @param {Object} properties The properties to be included into the given object.
         */
        design: function( properties ) {
            /* create the new object */
            // var obj = Bikini.Object._create(this);
            var obj = this._create(this);

            /* assign the properties passed with the arguments array */
            obj.include(this._normalize(properties));

            /* return the new object */
            return obj;
        },


        /**
         * Binds a method to its caller, so it is always executed within the right scope.
         *
         * @param {Object} caller The scope of the method that should be bound.
         * @param {Function} method The method to be bound.
         * @param {Object} arg One or more arguments. If more, then apply is used instead of call.
         */
        bindToCaller: function( caller, method, arg ) {
            return function() {
                if( typeof method !== 'function' || typeof caller !== 'object' ) {
                    throw Bikini.Exception.INVALID_INPUT_PARAMETER.getException();
                }
                if( Array.isArray(arg) ) {
                    return method.apply(caller, arg);
                }
                return method.call(caller, arg);
            };
        },

        /**
         * This method is used internally to normalize the properties object that is used
         * for extending a given object.
         *
         * @param obj
         * @returns {Object}
         * @private
         */
        _normalize: function( obj ) {
            obj = obj && typeof obj === 'object' ? obj : {};

            return obj;
        },

        /**
         * Calls a method defined by a handler
         *
         * @param {Object} handler A function, or an object including target and action to use with bindToCaller.
         */
        handleCallback: function( handler ) {
            var args = Array.prototype.slice.call(arguments, 1);
            if( handler ) {
                var target = typeof handler.target === 'object' ? handler.target : this;
                var action = handler;
                if( typeof handler.action === 'function' ) {
                    action = handler.action;
                } else if( typeof handler.action === 'string' ) {
                    action = target[handler.action];
                }
                if( typeof action === 'function' ) {
                    return this.bindToCaller(target, action, args)();
                }
            }
        }

    };

    /**
     * Readable alias for true
     *
     * @type {Boolean}
     */
    YES = true;

    /**
     * Readable alias for false
     *
     * @type {Boolean}
     */
    NO = false;


    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    // ===========================================================================
    //
    // Bikini.ObjectId uses code from meteor.js
    // https://github.com/meteor/meteor/blob/master/packages/minimongo
    //
    // Thanks for sharing!
    //
    // ===========================================================================

    // m_require('core/foundation/object.js');
    /**
     *
     * @module Bikini.ObjectID
     *
     */
    Bikini.ObjectID = function( hexString ) {
        Bikini.ObjectID.counter   = Bikini.ObjectID.counter   || parseInt(Math.random() * Math.pow(16, 6));
        Bikini.ObjectID.machineId = Bikini.ObjectID.machineId || parseInt(Math.random() * Math.pow(16, 6));
        Bikini.ObjectID.processId = Bikini.ObjectID.processId || parseInt(Math.random() * Math.pow(16, 4));
        this._ObjectID(hexString);
    };

    Bikini.ObjectID._looksLikeObjectID = function( str ) {
        return str.length === 24 && str.match(/^[0-9a-f]*$/);
    };

    _.extend(Bikini.ObjectID.prototype, {

        _str: '',

        _ObjectID: function( hexString ) {
            //random-based impl of Mongo ObjectID
            if( hexString ) {
                hexString = hexString.toLowerCase();
                if( !Bikini.ObjectID._looksLikeObjectID(hexString) ) {
                    throw new Error('Invalid hexadecimal string for creating an ObjectID');
                }
                // meant to work with _.isEqual(), which relies on structural equality
                this._str = hexString;
            } else {

                this._str =
                    this._hexString(8, new Date().getTime()/1000) +     // a 4-byte value from the Unix timestamp
                    this._hexString(6, Bikini.ObjectID.machineId) +          // a 3-byte machine identifier
                    this._hexString(4, Bikini.ObjectID.processId) +          // a 2-byte process identifier
                    this._hexString(6, Bikini.ObjectID.counter++);   // a 3-byte counter, starting with a random value.
            }
            return this._str;
        },

        _hexString: function(len, num) {
            num = num || parseInt(Math.random() * Math.pow(16,len));
            var str = num.toString(16);
            while(str.length < len) {
                str = '0'+str;
            }
            return str.substr(0, len);
        },

        toString: function() {
            return 'ObjectID(\'' + this._str + '\')';
        },

        equals: function( other ) {
            return other instanceof this._ObjectID && this.valueOf() === other.valueOf();
        },

        clone: function() {
            return new Bikini.ObjectID(this._str);
        },

        typeName: function() {
            return 'oid';
        },

        getTimestamp: function() {
            return parseInt(this._str.substr(0, 8), 16)*1000;
        },

        getMachineId: function() {
            return parseInt(this._str.substr(8, 6), 16);
        },

        getProcessId: function() {
            return parseInt(this._str.substr(14, 4), 16);
        },

        getCounter: function() {
            return parseInt(this._str.substr(18, 6), 16);
        },

        valueOf: function() {
            return this._str;
        },

        toJSON: function() {
            return this._str;
        },

        toHexString: function() {
            return this._str;
        },

        // Is this selector just shorthand for lookup by _id?
        _selectorIsId: function( selector ) {
            return (typeof selector === 'string') ||
                (typeof selector === 'number') ||
                selector instanceof Bikini.ObjectId;
        },

        // Is the selector just lookup by _id (shorthand or not)?
        _selectorIsIdPerhapsAsObject: function( selector ) {
            return this._selectorIsId(selector) || (selector && typeof selector === 'object' && selector._id && this._selectorIsId(selector._id) && _.size(selector) === 1);
        },

        // If this is a selector which explicitly constrains the match by ID to a finite
        // number of documents, returns a list of their IDs.  Otherwise returns
        // null. Note that the selector may have other restrictions so it may not even
        // match those document!  We care about $in and $and since those are generated
        // access-controlled update and remove.
        _idsMatchedBySelector: function( selector ) {
            // Is the selector just an ID?
            if( this._selectorIsId(selector) ) {
                return [selector];
            }
            if( !selector ) {
                return null;
            }

            // Do we have an _id clause?
            if( _.has(selector, '_id') ) {
                // Is the _id clause just an ID?
                if( this._selectorIsId(selector._id) ) {
                    return [selector._id];
                }
                // Is the _id clause {_id: {$in: ["x", "y", "z"]}}?
                if( selector._id && selector._id.$in && _.isArray(selector._id.$in) && !_.isEmpty(selector._id.$in) && _.all(selector._id.$in, this._selectorIsId) ) {
                    return selector._id.$in;
                }
                return null;
            }

            // If this is a top-level $and, and any of the clauses constrain their
            // documents, then the whole selector is constrained by any one clause's
            // constraint. (Well, by their intersection, but that seems unlikely.)
            if( selector.$and && _.isArray(selector.$and) ) {
                for( var i = 0; i < selector.$and.length; ++i ) {
                    var subIds = this._idsMatchedBySelector(selector.$and[i]);
                    if( subIds ) {
                        return subIds;
                    }
                }
            }

            return null;
        }
    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    // Returns a unique identifier

    /**
     *
     * @module Bikini.UniqueId
     *
     * @type {*}
     * @extends Bikini.Object
     */
    Bikini.UniqueId = Bikini.Object.design({
        uuid: function(len, radix) {
            // based on Robert Kieffer's randomUUID.js at http://www.broofa.com
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [];
            //len = len ? len : 32; 
            radix = radix || chars.length;
            var i;

            if (len) {
                for (i = 0; i < len; i++) {
                    uuid[i] = chars[0 | Math.random() * radix];
                }
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            return uuid.join('');
        }
    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * This prototype defines decoding and encoding mechanisms based on the Base64 algorithm. You
     * normally don't call this object respectively its methods directly, but let Bikini.Cypher handle
     * this.
     * @module Bikini.Base64
     *
     * @extends Bikini.Object
     */
    Bikini.Base64 = Bikini.Object.design(/** @scope Bikini.Base64.prototype */ {

        /**
         * The type of this object.
         *
         * @type String
         */
        type: 'Bikini.Base64',

        /**
         * The key string for the base 64 decoding and encoding.
         *
         * @type String
         */
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        /**
         * This method encodes a given binary input, using the base64 encoding.
         *
         * @param {String} input The binary to be encoded. (e.g. an requested image)
         * @returns {String} The base64 encoded string.
         */
        encodeBinary: function( input ) {
            var output = '';
            var bytebuffer;
            var encodedCharIndexes = new Array(4);
            var inx = 0;
            var paddingBytes = 0;

            while( inx < input.length ) {
                // Fill byte buffer array
                bytebuffer = new Array(3);
                for( var jnx = 0; jnx < bytebuffer.length; jnx++ ) {
                    if( inx < input.length ) {
                        bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff;
                    } // throw away high-order byte, as documented at: https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
                    else {
                        bytebuffer[jnx] = 0;
                    }
                }

                // Get each encoded character, 6 bits at a time
                // index 1: first 6 bits
                encodedCharIndexes[0] = bytebuffer[0] >> 2;
                // index 2: second 6 bits (2 least significant bits from input byte 1 + 4 most significant bits from byte 2)
                encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
                // index 3: third 6 bits (4 least significant bits from input byte 2 + 2 most significant bits from byte 3)
                encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
                // index 3: forth 6 bits (6 least significant bits from input byte 3)
                encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

                // Determine whether padding happened, and adjust accordingly
                paddingBytes = inx - (input.length - 1);
                switch( paddingBytes ) {
                    case 2:
                        // Set last 2 characters to padding char
                        encodedCharIndexes[3] = 64;
                        encodedCharIndexes[2] = 64;
                        break;
                    case 1:
                        // Set last character to padding char
                        encodedCharIndexes[3] = 64;
                        break;
                    default:
                        break; // No padding - proceed
                }
                // Now we will grab each appropriate character out of our keystring
                // based on our index array and append it to the output string
                for( jnx = 0; jnx < encodedCharIndexes.length; jnx++ ) {
                    output += this._keyStr.charAt(encodedCharIndexes[jnx]);
                }
            }
            return output;
        },

        /**
         * This method encodes a given input string, using the base64 encoding.
         *
         * @param {String} input The string to be encoded.
         * @returns {String} The base64 encoded string.
         */
        encode: function( input ) {
            var output = '';
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Bikini.Cypher.utf8Encode(input);

            while( i < input.length ) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if( isNaN(chr2) ) {
                    enc3 = enc4 = 64;
                } else if( isNaN(chr3) ) {
                    enc4 = 64;
                }

                output += this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }

            return output;
        },

        binaryEncode: function( input ) {
            var output = '';
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            while( i < input.length ) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if( isNaN(chr2) ) {
                    enc3 = enc4 = 64;
                } else if( isNaN(chr3) ) {
                    enc4 = 64;
                }

                output += this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }

            return output;
        },

        /**
         * This method decodes a given input string, using the base64 decoding.
         *
         * @param {String} input The string to be decoded.
         * @returns {String} The base64 decoded string.
         */
        decode: function( input ) {
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

            while( i < input.length ) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if( enc3 !== 64 ) {
                    output = output + String.fromCharCode(chr2);
                }

                if( enc4 !== 64 ) {
                    output = output + String.fromCharCode(chr3);
                }
            }

            return Bikini.Cypher.utf8Decode(output);
        }

    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * This prototype defines a hashing mechanism based on the SHA256 algorithm. You normally
     * don't call this object respectively its methods directly, but let Bikini.Cypher handle
     * this.
     * @module Bikini.SHA256
     *
     * @extends Bikini.Object
     */
    Bikini.SHA256 = Bikini.Object.design(/** @scope Bikini.SHA256.prototype */ {

        /**
         * The type of this object.
         *
         * @type String
         */
        type: 'Bikini.SHA256',

        /**
         * Defines the bits per input character: 8 - ASCII, 16 - Unicode
         *
         * @type Number
         */
        chrsz: 8,

        /**
         * Defines the hex output format: 0 - lowercase, 1 - uppercase
         *
         * @type Number
         */
        hexcase: 0,

        /**
         * This method is called from the 'outside world', controls the hashing and
         * finally returns the hash value.
         *
         * @param {String} input The input string to be hashed.
         * @returns {String} The sha256 hashed string.
         */
        hash: function( input ) {
            input = Bikini.Cypher.utf8Encode(input);
            return this.binb2hex(this.coreSha256(this.str2binb(input), input.length * this.chrsz));
        },

        /**
         * @private
         */
        safeAdd: function( x, y ) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },

        /**
         * @private
         */
        S: function( X, n ) {
            return ( X >>> n ) | (X << (32 - n));
        },

        /**
         * @private
         */
        R: function( X, n ) {
            return ( X >>> n );
        },

        /**
         * @private
         */
        Ch: function( x, y, z ) {
            return ((x & y) ^ ((~x) & z));
        },

        /**
         * @private
         */
        Maj: function( x, y, z ) {
            return ((x & y) ^ (x & z) ^ (y & z));
        },

        /**
         * @private
         */
        Sigma0256: function( x ) {
            return (this.S(x, 2) ^ this.S(x, 13) ^ this.S(x, 22));
        },

        /**
         * @private
         */
        Sigma1256: function( x ) {
            return (this.S(x, 6) ^ this.S(x, 11) ^ this.S(x, 25));
        },

        /**
         * @private
         */
        Gamma0256: function( x ) {
            return (this.S(x, 7) ^ this.S(x, 18) ^ this.R(x, 3));
        },

        /**
         * @private
         */
        Gamma1256: function( x ) {
            return (this.S(x, 17) ^ this.S(x, 19) ^ this.R(x, 10));
        },

        /**
         * @private
         */
        coreSha256: function( m, l ) {
            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for( i = 0; i < m.length; i += 16 ) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for( j = 0; j < 64; j++ ) {
                    if( j < 16 ) {
                        W[j] = m[j + i];
                    } else {
                        W[j] = this.safeAdd(this.safeAdd(this.safeAdd(this.Gamma1256(W[j - 2]), W[j - 7]), this.Gamma0256(W[j - 15])), W[j - 16]);
                    }

                    T1 = this.safeAdd(this.safeAdd(this.safeAdd(this.safeAdd(h, this.Sigma1256(e)), this.Ch(e, f, g)), K[j]), W[j]);
                    T2 = this.safeAdd(this.Sigma0256(a), this.Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = this.safeAdd(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = this.safeAdd(T1, T2);
                }

                HASH[0] = this.safeAdd(a, HASH[0]);
                HASH[1] = this.safeAdd(b, HASH[1]);
                HASH[2] = this.safeAdd(c, HASH[2]);
                HASH[3] = this.safeAdd(d, HASH[3]);
                HASH[4] = this.safeAdd(e, HASH[4]);
                HASH[5] = this.safeAdd(f, HASH[5]);
                HASH[6] = this.safeAdd(g, HASH[6]);
                HASH[7] = this.safeAdd(h, HASH[7]);
            }
            return HASH;
        },

        /**
         * @private
         */
        str2binb: function( str ) {
            var bin = [];
            var mask = (1 << this.chrsz) - 1;
            for( var i = 0; i < str.length * this.chrsz; i += this.chrsz ) {
                bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (24 - i % 32);
            }
            return bin;
        },

        /**
         * @private
         */
        binb2hex: function( binarray ) {
            var hexTab = this.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
            var str = '';
            for( var i = 0; i < binarray.length * 4; i++ ) {
                str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8  )) & 0xF);
            }
            return str;
        }

    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * Bikini.Cypher defines a prototype for handling decoding, encoding and hashing of string
     * based values.
     * @module Bikini.Cypher
     *
     * @extends Bikini.Object
     */
    Bikini.Cypher = Bikini.Object.design(/** @scope Bikini.Cypher.prototype */ {

        /**
         * The type of this object.
         *
         * @type String
         */
        type: 'Bikini.Cypher',

        /**
         * The default decoder.
         *
         * @type Bikini.Base64
         */
        defaultDecoder: Bikini.Base64,

        /**
         * The default encoder.
         *
         * @type Bikini.Base64
         */

        defaultEncoder: Bikini.Base64,

        /**
         * The default hash algorithm.
         *
         * @type Bikini.SHA256
         */

        defaultHasher: Bikini.SHA256,

        /**
         * This method is the one that initiates the decoding of a given string, based on either
         * the default decoder or a custom decoder.
         *
         * @param {String} input The input string to be decoded.
         * @param {Object} algorithm The algorithm object containing a decode method.
         * @returns {String} The decoded string.
         */
        decode: function( input, algorithm ) {

            if( algorithm && algorithm.decode ) {
                return algorithm.decode(input);
            } else {
                return this.defaultDecoder.decode(input);
            }

        },

        /**
         * This method is the one that initiates the encoding of a given string, based on either
         * the default encoder or a custom encoder.
         *
         * @param {String} input The input string to be decoded.
         * @param {Object} algorithm The algorithm object containing a encode method.
         * @returns {String} The encoded string.
         */
        encode: function( input, algorithm ) {

            if( algorithm && algorithm.encode ) {
                return algorithm.encode(input);
            } else {
                return this.defaultEncoder.encode(input);
            }

        },

        /**
         * This method is the one that initiates the hashing of a given string, based on either
         * the default hashing algorithm or a custom hashing algorithm.
         *
         * @param {String} input The input string to be hashed.
         * @param {Object} algorithm The algorithm object containing a hash method.
         * @returns {String} The hashed string.
         */
        hash: function( input, algorithm ) {

            if( algorithm && algorithm.hash ) {
                return algorithm.hash(input);
            } else {
                return this.defaultHasher.hash(input);
            }

        },

        /**
         * Private method for UTF-8 encoding
         *
         * @private
         * @param {String} string The string to be encoded.
         * @returns {String} The utf8 encoded string.
         */
        utf8Encode: function( string ) {
            string = string.replace(/\r\n/g, '\n');
            var utf8String = '';

            for( var n = 0; n < string.length; n++ ) {

                var c = string.charCodeAt(n);

                if( c < 128 ) {
                    utf8String += String.fromCharCode(c);
                } else if( (c > 127) && (c < 2048) ) {
                    utf8String += String.fromCharCode((c >> 6) | 192);
                    utf8String += String.fromCharCode((c & 63) | 128);
                } else {
                    utf8String += String.fromCharCode((c >> 12) | 224);
                    utf8String += String.fromCharCode(((c >> 6) & 63) | 128);
                    utf8String += String.fromCharCode((c & 63) | 128);
                }

            }

            return utf8String;
        },

        /**
         * Private method for UTF-8 decoding
         *
         * @private
         * @param {String} string The string to be decoded.
         * @returns {String} The utf8 decoded string.
         */
        utf8Decode: function( utf8String ) {
            var string = '';
            var i;
            var c;
            var c1;
            var c2;
            var c3;
            i = c = c1 = c2 = 0;

            while( i < utf8String.length ) {

                c = utf8String.charCodeAt(i);

                if( c < 128 ) {
                    string += String.fromCharCode(c);
                    i++;
                } else if( (c > 191) && (c < 224) ) {
                    c2 = utf8String.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utf8String.charCodeAt(i + 1);
                    c3 = utf8String.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }

    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     *
     * @module Bikini.Date
     *
     * @extends Bikini.Object
     */
    Bikini.Date = {

        /**
         * This method is used to create a new instance of Bikini.Date based on the data
         * library moment.js.
         *
         * @returns {Object}
         */
        create: function() {
            var m = moment.apply(this, arguments);
            return _.extend(m, this);
        }
    };


    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     *
     * @module Bikini.Field
     *
     */

    /**
     * Field describing a data attribute
     *
     * contains functions to comperate, detect and convert data type
     *
     * @param options
     * @constructor
     */
    Bikini.Field = function (options) {
        this.merge(options);
        this.initialize.apply(this, arguments);
    };

    Bikini.Field.extend = Bikini.extend;
    Bikini.Field.create = Bikini.create;
    Bikini.Field.design = Bikini.design;

    _.extend(Bikini.Field.prototype, Bikini.Object, {

        /**
         * The type of this object.
         *
         * @type String
         */
        _type: 'Bikini.Field',

        name: null,

        type: null,

        index: null,

        defaultValue: undefined,

        length: null,

        required: NO,

        persistent: YES,

        initialize: function () {
        },

        /**
         * merge field properties into this instance
         *
         * @param obj
         */
        merge: function (obj) {
            obj = _.isString(obj) ? { type: obj } : (obj || {});

            this.name = !_.isUndefined(obj.name) ? obj.name : this.name;
            this.type = !_.isUndefined(obj.type) ? obj.type : this.type;
            this.index = !_.isUndefined(obj.index) ? obj.index : this.index;
            this.defaultValue = !_.isUndefined(obj.defaultValue) ? obj.defaultValue : this.defaultValue;
            this.length = !_.isUndefined(obj.length) ? obj.length : this.length;
            this.required = !_.isUndefined(obj.required) ? obj.required : this.required;
            this.persistent = !_.isUndefined(obj.persistent) ? obj.persistent : this.persistent;
        },

        /**
         * converts the give value into the required data type
         *
         * @param value
         * @param type
         * @returns {*}
         */
        transform: function (value, type) {
            type = type || this.type;
            try {
                if (_.isUndefined(value)) {
                    return this.defaultValue;
                }
                if (type === Bikini.DATA.TYPE.STRING || type === Bikini.DATA.TYPE.TEXT) {
                    if (_.isObject(value)) {
                        return JSON.stringify(value);
                    } else {
                        return _.isNull(value) ? 'null' : value.toString();
                    }
                } else if (type === Bikini.DATA.TYPE.INTEGER) {
                    return parseInt(value);
                } else if (type === Bikini.DATA.TYPE.BOOLEAN) {
                    return value === true || value === 'true'; // true, 1, "1" or "true"
                } else if (type === Bikini.DATA.TYPE.FLOAT) {
                    return parseFloat(value);
                } else if (type === Bikini.DATA.TYPE.OBJECT || type === Bikini.DATA.TYPE.ARRAY) {
                    if (!_.isObject(value)) {
                        return _.isString(value) ? JSON.parse(value) : null;
                    }
                } else if (type === Bikini.DATA.TYPE.DATE) {
                    if (!Bikini.Date.isPrototypeOf(value)) {
                        var date = value ? Bikini.Date.create(value) : null;
                        return date && date.isValid() ? date : null;
                    }
                } else if (type === Bikini.DATA.TYPE.OBJECTID) {
                    if (!Bikini.ObjectID.prototype.isPrototypeOf(value)) {
                        return _.isString(value) ? new Bikini.ObjectID(value) : null;
                    }
                }
                return value;
            } catch (e) {
                console.error('Failed converting value! ' + e.message);
            }
        },

        /**
         * check to values to be equal for the type of this field
         *
         * @param a
         * @param b
         * @returns {*}
         */
        equals: function (a, b) {
            var v1 = this.transform(a);
            var v2 = this.transform(b);
            return this._equals(v1, v2, _.isArray(v1));
        },

        /**
         * check if this field holds binary data
         *
         * @param obj
         * @returns {boolean|*}
         */
        isBinary: function (obj) {
            return (typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array) || (obj && obj.$Uint8ArrayPolyfill);
        },

        /**
         * detect the type of a given value
         *
         * @param v
         * @returns {*}
         */
        detectType: function (v) {
            if (_.isNumber(v)) {
                return Bikini.DATA.TYPE.FLOAT;
            }
            if (_.isString(v)) {
                return Bikini.DATA.TYPE.STRING;
            }
            if (_.isBoolean(v)) {
                return Bikini.DATA.TYPE.BOOLEAN;
            }
            if (_.isArray(v)) {
                return Bikini.DATA.TYPE.ARRAY;
            }
            if (_.isNull(v)) {
                return Bikini.DATA.TYPE.NULL;
            }
            if (_.isDate(v) || Bikini.Date.isPrototypeOf(v)) {
                return Bikini.DATA.TYPE.DATE;
            }
            if (Bikini.ObjectID.prototype.isPrototypeOf(v)) {
                return Bikini.DATA.TYPE.OBJECTID;
            }
            if (this.isBinary(v)) {
                return Bikini.DATA.TYPE.BINARY;
            }
            return Bikini.DATA.TYPE.OBJECT;
        },

        /**
         * returns the sort order for the given type, used by sorting different type
         *
         * @param type
         * @returns {number}
         */
        typeOrder: function (type) {
            switch (type) {
                case Bikini.DATA.TYPE.NULL   :
                    return 0;
                case Bikini.DATA.TYPE.FLOAT  :
                    return 1;
                case Bikini.DATA.TYPE.STRING :
                    return 2;
                case Bikini.DATA.TYPE.OBJECT :
                    return 3;
                case Bikini.DATA.TYPE.ARRAY  :
                    return 4;
                case Bikini.DATA.TYPE.BINARY :
                    return 5;
                case Bikini.DATA.TYPE.DATE   :
                    return 6;
            }
            return -1;
        },

        _equals: function (a, b, keyOrderSensitive) {
            var that = this;
            var i;
            if (a === b) {
                return true;
            }
            if (!a || !b) { // if either one is false, they'd have to be === to be equal
                return false;
            }
            if (!(_.isObject(a) && _.isObject(b))) {
                return false;
            }
            if (a instanceof Date && b instanceof Date) {
                return a.valueOf() === b.valueOf();
            }
            if (this.isBinary(a) && this.isBinary(b)) {
                if (a.length !== b.length) {
                    return false;
                }
                for (i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            }
            if (_.isFunction(a.equals)) {
                return a.equals(b);
            }
            if (_.isArray(a)) {
                if (!_.isArray(b)) {
                    return false;
                }
                if (a.length !== b.length) {
                    return false;
                }
                for (i = 0; i < a.length; i++) {
                    if (!that.equals(a[i], b[i], keyOrderSensitive)) {
                        return false;
                    }
                }
                return true;
            }
            // fall back to structural equality of objects
            var ret;
            if (keyOrderSensitive) {
                var bKeys = [];
                _.each(b, function (val, x) {
                    bKeys.push(x);
                });
                i = 0;
                ret = _.all(a, function (val, x) {
                    if (i >= bKeys.length) {
                        return false;
                    }
                    if (x !== bKeys[i]) {
                        return false;
                    }
                    if (!that.equals(val, b[bKeys[i]], keyOrderSensitive)) {
                        return false;
                    }
                    i++;
                    return true;
                });
                return ret && i === bKeys.length;
            } else {
                i = 0;
                ret = _.all(a, function (val, key) {
                    if (!_.has(b, key)) {
                        return false;
                    }
                    if (!that.equals(val, b[key], keyOrderSensitive)) {
                        return false;
                    }
                    i++;
                    return true;
                });
                return ret && _.size(b) === i;
            }
        },

        /**
         * compare two values of unknown type according to BSON ordering
         * semantics. (as an extension, consider 'undefined' to be less than
         * any other value.) return negative if a is less, positive if b is
         * less, or 0 if equal
         *
         * @param a
         * @param b
         * @returns {*}
         * @private
         */
        _cmp: function (a, b) {
            if (a === undefined) {
                return b === undefined ? 0 : -1;
            }
            if (b === undefined) {
                return 1;
            }
            var i = 0;
            var ta = this.detectType(a);
            var tb = this.detectType(b);
            var oa = this.typeOrder(ta);
            var ob = this.typeOrder(tb);
            if (oa !== ob) {
                return oa < ob ? -1 : 1;
            }
            if (ta !== tb) {
                throw new Error('Missing type coercion logic in _cmp');
            }
            if (ta === 7) { // ObjectID
                // Convert to string.
                ta = tb = 2;
                a = a.toHexString();
                b = b.toHexString();
            }
            if (ta === Bikini.DATA.TYPE.DATE) {
                // Convert to millis.
                ta = tb = 1;
                a = a.getTime();
                b = b.getTime();
            }
            if (ta === Bikini.DATA.TYPE.FLOAT) {
                return a - b;
            }
            if (tb === Bikini.DATA.TYPE.STRING) {
                return a < b ? -1 : (a === b ? 0 : 1);
            }
            if (ta === Bikini.DATA.TYPE.OBJECT) {
                // this could be much more efficient in the expected case ...
                var toArray = function (obj) {
                    var ret = [];
                    for (var key in obj) {
                        ret.push(key);
                        ret.push(obj[key]);
                    }
                    return ret;
                };
                return this._cmp(toArray(a), toArray(b));
            }
            if (ta === Bikini.DATA.TYPE.ARRAY) { // Array
                for (i = 0; ; i++) {
                    if (i === a.length) {
                        return (i === b.length) ? 0 : -1;
                    }
                    if (i === b.length) {
                        return 1;
                    }
                    var s = this._cmp(a[i], b[i]);
                    if (s !== 0) {
                        return s;
                    }
                }
            }
            if (ta === Bikini.DATA.TYPE.BINARY) {
                if (a.length !== b.length) {
                    return a.length - b.length;
                }
                for (i = 0; i < a.length; i++) {
                    if (a[i] < b[i]) {
                        return -1;
                    }
                    if (a[i] > b[i]) {
                        return 1;
                    }
                }
                return 0;
            }
            if (ta === Bikini.DATA.TYPE.BOOLEAN) {
                if (a) {
                    return b ? 0 : 1;
                }
                return b ? -1 : 0;
            }
            if (ta === Bikini.DATA.TYPE.NULL) {
                return 0;
            }
            //        if( ta === Bikini.DATA.TYPE.REGEXP ) {
            //            throw Error("Sorting not supported on regular expression");
            //        } // XXX
            //        if( ta === 13 ) // javascript code
            //        {
            //            throw Error("Sorting not supported on Javascript code");
            //        } // XXX
            throw new Error('Unknown type to sort');
        }
    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     *
     * @module Bikini.Entity
     *
     */

    /**
     * Holds description about fields and other entity properties.
     * Also helper functions for field and transform operations
     * @module Bikini.Entity
     *
     * @param options
     * @constructor
     */
    Bikini.Entity = function (options) {
        var fields = this.fields;
        this.fields = {};
        this._mergeFields(fields);
        options = options || {};
        if (options.fields) {
            this._mergeFields(options.fields);
        }
        this.typeMapping = options.typeMapping || this.typeMapping;
        var collection = options.collection;
        var model = options.model || (collection ? collection.prototype.model : null);
        this.idAttribute = options.idAttribute || this.idAttribute || (model ? model.prototype.idAttribute : '');
        this._updateFields(this.typeMapping);
        this.initialize.apply(this, arguments);
    };

    /**
     * create a new entity from an other entity or given properties
     *
     * @param entity
     * @param options
     * @returns {*}
     */
    Bikini.Entity.from = function (entity, options) {
        // is not an instance of Bikini.Entity
        if (!Bikini.Entity.prototype.isPrototypeOf(entity)) {
            // if this is a prototype of an entity, create an instance
            if (_.isFunction(entity) &&
                Bikini.Entity.prototype.isPrototypeOf(entity.prototype)) {
                var Entity = entity;
                entity = new Entity(options);
            } else {
                if (typeof entity === 'string') {
                    entity = {
                        name: entity
                    };
                }
                // if this is just a config create a new Entity
                var E = Bikini.Entity.extend(entity);
                entity = new E(options);
            }
        } else if (options && options.typeMapping) {
            entity._updateFields(options.typeMapping);
        }
        return entity;
    };

    Bikini.Entity.extend = Bikini.extend;
    Bikini.Entity.create = Bikini.create;
    Bikini.Entity.design = Bikini.design;

    _.extend(Bikini.Entity.prototype, Bikini.Object, {

        /**
         * The type of this object.
         *
         * @type String
         */
        _type: 'Bikini.Entity',

        /**
         * Entity name, used for tables or collections
         *
         * @type String
         */
        name: '',

        /**
         * idAttribute, should be the same as in the corresponding model
         *
         * @type String
         */
        idAttribute: '',

        /**
         *
         *
         * @type Object
         */
        fields: {},

        /**
         * initialize function will be called after creating an entity
         */
        initialize: function () {
        },

        /**
         * get the field list of this entity
         *
         * @returns {Object}
         */
        getFields: function () {
            return this.fields;
        },

        /**
         * get a specified field from this entity
         *
         * @param fieldKey
         * @returns Bikini.Field instance
         */
        getField: function (fieldKey) {
            return this.fields[fieldKey];
        },

        /**
         * get the translated name of a field
         *
         * @param fieldKey
         * @returns String
         */
        getFieldName: function (fieldKey) {
            var field = this.getField(fieldKey);
            return field && field.name ? field.name : fieldKey;
        },

        /**
         * get the primary key of this entity
         *
         * @returns String
         */
        getKey: function () {
            return this.idAttribute || Bikini.Model.idAttribute;
        },

        /**
         * get a list of keys for this entity
         *
         * @returns {Array}
         */
        getKeys: function () {
            return this.splitKey(this.getKey());
        },

        /**
         * Splits a comma separated list of keys to a key array
         *
         * @returns {Array} array of keys
         */
        splitKey: function (key) {
            var keys = [];
            if (_.isString(key)) {
                _.each(key.split(','), function (key) {
                    var k = key.trim();
                    if (k) {
                        keys.push(k);
                    }
                });
            }
            return keys;
        },

        /**
         * merge a new list of fields into the exiting fields
         *
         * @param newFields
         * @private
         */
        _mergeFields: function (newFields) {
            if (!_.isObject(this.fields)) {
                this.fields = {};
            }
            var that = this;
            if (_.isObject(newFields)) {
                _.each(newFields, function (value, key) {
                    if (!that.fields[key]) {
                        that.fields[key] = new Bikini.Field(value);
                    } else {
                        that.fields[key].merge(value);
                    }
                });
            }
        },

        /**
         * check and update missing properties of fields
         *
         * @param typeMapping
         * @private
         */
        _updateFields: function (typeMapping) {
            var that = this;
            _.each(this.fields, function (value, key) {
                // remove unused properties
                if (value.persistent === NO) {
                    delete that.fields[key];
                } else {
                    // add missing names
                    if (!value.name) {
                        value.name = key;
                    }
                    // apply default type conversions
                    if (typeMapping && typeMapping[value.type]) {
                        value.type = typeMapping[value.type];
                    }
                }
            });
        },

        /**
         * transform the given data to attributes
         * considering the field specifications
         *
         * @param data
         * @param id
         * @param fields
         * @returns {*}
         */
        toAttributes: function (data, id, fields) {
            fields = fields || this.fields;
            if (data && !_.isEmpty(fields)) {
                // map field names
                var value, attributes = {};
                _.each(fields, function (field, key) {
                    value = _.isFunction(data.get) ? data.get(field.name) : data[field.name];
                    attributes[key] = value;
                });
                return attributes;
            }
            return data;
        },

        /**
         * transform the given attributes to the destination data format
         * considering the field specifications
         *
         * @param attrs
         * @param fields
         * @returns {*}
         */
        fromAttributes: function (attrs, fields) {
            fields = fields || this.fields;
            if (attrs && !_.isEmpty(fields)) {
                var data = {};
                _.each(fields, function (field, key) {
                    var value = _.isFunction(attrs.get) ? attrs.get(key) : attrs[key];
                    value = field.transform(value);
                    if (!_.isUndefined(value)) {
                        data[field.name] = value;
                    }
                });
                return data;
            }
            return attrs;
        },

        /**
         * set the id of the given model or attributes
         *
         * @param attrs
         * @param id
         * @returns {*}
         */
        setId: function (attrs, id) {
            if (attrs && id) {
                var key = this.getKey() || attrs.idAttribute;
                if (key) {
                    if (_.isFunction(attrs.set)) {
                        attrs.set(key, id);
                    } else {
                        attrs[key] = id;
                    }
                }
            }
            return attrs;
        },

        /**
         * get the id of the given model or attributes
         *
         * @param attrs
         * @returns {*|Object|key|*}
         */
        getId: function (attrs) {
            if (attrs) {
                var key = this.getKey() || attrs.idAttribute;
                if (key) {
                    return _.isFunction(attrs.get) ? attrs.get(key) : attrs[key];
                }
            }
        }
    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     *
     * @module Bikini.Security
     *
     * @type {{logon: Function, logonBasicAuth: Function, logonMcapAuth: Function, getHost: Function}}
     */
    Bikini.Security = Bikini.Object.design({


        logon: function (options, callback) {
            var credentials = options ? options.credentials : null;
            if (credentials) {
                switch (credentials.type) {
                    case 'basic':
                        return this.logonBasicAuth(options, callback);
                }
            }
            this.handleCallback(callback);
        },

        logonBasicAuth: function (options, callback) {
            var credentials = options.credentials;
            options.beforeSend = function (xhr) {
                Bikini.Security.setBasicAuth(xhr, credentials);
            };
            this.handleCallback(callback);
        },

        setBasicAuth: function( xhr, credentials ) {
            if( credentials && credentials.username && xhr && Bikini.Base64 ) {
                var basicAuth = Bikini.Base64.encode(encodeURIComponent(credentials.username + ':' + (credentials.password || '')));
                xhr.setRequestHeader('Authorization', 'Basic ' + basicAuth);
            }
        }

    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     *
     * @module Bikini.Model
     *
     * @type {*}
     * @extends Backbone.Model
     */
    Bikini.Model = Backbone.Model.extend({
        constructor: function( attributes, options ) {
            this.init(attributes, options);
            Backbone.Model.apply(this, arguments);
        }
    });

    Bikini.Model.create = Bikini.create;
    Bikini.Model.design = Bikini.design;

    _.extend(Bikini.Model.prototype, Bikini.Object, {

        _type: 'Bikini.Model',

        isModel: YES,

        entity: null,

        defaults: {},

        changedSinceSync: {},

        logon: Bikini.Security.logon,

        init: function( attributes, options ) {
            options = options || {};

            this.collection = options.collection || this.collection;
            this.idAttribute = options.idAttribute || this.idAttribute;
            this.store = this.store || (this.collection ? this.collection.store : null) || options.store;
            if( this.store && _.isFunction(this.store.initModel) ) {
                this.store.initModel(this, options);
            }
            this.entity = this.entity || (this.collection ? this.collection.entity : null) || options.entity;
            if( this.entity ) {
                this.entity = Bikini.Entity.from(this.entity, { model: this.constructor, typeMapping: options.typeMapping });
                this.idAttribute = this.entity.idAttribute || this.idAttribute;
            }
            this.credentials = this.credentials || (this.collection ? this.collection.credentials : null) || options.credentials;
            this.on('change', this.onChange, this);
            this.on('sync', this.onSync, this);
        },

        sync: function( method, model, options ) {
            options = options || {};
            options.credentials = options.credentials || this.credentials;
            var store = (options.store ? options.store : null) || this.store;
            var that = this;
            var args = arguments;

            this.logon(options, function( result ) {
                if( store && _.isFunction(store.sync) ) {
                    return store.sync.apply(that, args);
                } else {
                    return Backbone.sync.apply(that, args);
                }
            });
        },

        onChange: function( model, options ) {
            // For each `set` attribute, update or delete the current value.
            var attrs = model.changedAttributes();
            if( _.isObject(attrs) ) {
                for( var key in attrs ) {
                    this.changedSinceSync[key] = attrs[key];
                }
            }
        },

        onSync: function( model, options ) {
            this.changedSinceSync = {};
        },

        getUrlRoot: function() {
            if( this.urlRoot ) {
                return _.isFunction(this.urlRoot) ? this.urlRoot() : this.urlRoot;
            } else if( this.collection ) {
                return this.collection.getUrlRoot();
            } else if( this.url ) {
                var url = _.isFunction(this.url) ? this.url() : this.url;
                if( url && this.id && url.indexOf(this.id) > 0 ) {
                    return url.substr(0, url.indexOf(this.id));
                }
                return url;
            }
        },

        toJSON: function( options ) {
            options = options || {};
            var entity = options.entity || this.entity;
            if( Bikini.isEntity(entity) ) {
                return entity.fromAttributes(options.attrs || this.attributes);
            }
            return options.attrs || _.clone(this.attributes);
        },

        parse: function( resp, options ) {
            options = options || {};
            var entity = options.entity || this.entity;
            if( Bikini.isEntity(entity) ) {
                return entity.toAttributes(resp);
            }
            return resp;
        }

    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * The Bikini.Collection can be used like a Backbone Collection,
     *
     * but there are some enhancements to fetch, save and delete the
     * contained models from or to other "data stores".
     *
     * see LocalStorageStore, WebSqlStore or BikiniStore for examples
     *
     * @module Bikini.Collection
     *
     * @type {*}
     * @extends Backbone.Collection
     *
     */
    Bikini.Collection = Backbone.Collection.extend({

        constructor: function (options) {
            this.init(options);
            Backbone.Collection.apply(this, arguments);
        }
    });

    Bikini.Collection.create = Bikini.create;
    Bikini.Collection.design = Bikini.design;

    _.extend(Bikini.Collection.prototype, Bikini.Object, {

        _type: 'Bikini.Collection',

        isCollection: YES,

        model: Bikini.Model,

        entity: null,

        options: null,

        logon: Bikini.Security.logon,

        init: function (options) {
            options = options || {};
            this.store = options.store || this.store || (this.model ? this.model.prototype.store : null);
            this.entity = options.entity || this.entity || (this.model ? this.model.prototype.entity : null);
            this.options = options.options || this.options;

            var entity = this.entity || this.entityFromUrl(this.url);
            if (entity) {
                this.entity = Bikini.Entity.from(entity, { model: this.model, typeMapping: options.typeMapping });
            }
            this._updateUrl();

            if (this.store && _.isFunction(this.store.initCollection)) {
                this.store.initCollection(this, options);
            }
        },

        entityFromUrl: function (url) {
            if (url) {
                // extract last path part as entity name
                var parts = Bikini.Request.getLocation(this.url).pathname.match(/([^\/]+)\/?$/);
                if (parts && parts.length > 1) {
                    return parts[1];
                }
            }
        },

        sort: function (options) {
            if (_.isObject(options && options.sort)) {
                this.comparator = Bikini.DataSelector.compileSort(options.sort);
            }
            Backbone.Collection.prototype.sort.apply(this, arguments);
        },

        select: function (options) {
            var selector = options && options.query ? Bikini.DataSelector.create(options.query) : null;
            var collection = Bikini.Collection.create(null, { model: this.model });

            if (options && options.sort) {
                collection.comparator = Bikini.DataSelector.compileSort(options.sort);
            }

            this.each(function (model) {
                if (!selector || selector.matches(model.attributes)) {
                    collection.add(model);
                }
            });
            return collection;
        },

        destroy: function (options) {
            options = options || {};
            var success = options.success;
            if (this.length > 0) {
                options.success = function () {
                    if (this.length === 0 && success) {
                        success();
                    }
                };
                var model;
                while ((model = this.first())) {
                    this.sync('delete', model, options);
                    this.remove(model);
                }
            } else if (success) {
                success();
            }
        },

        sync: function (method, model, options) {
            options = options || {};
            options.credentials = options.credentials || this.credentials;
            var store = (options.store ? options.store : null) || this.store;
            var that = this;
            var args = arguments;

            this.logon(options, function (result) {
                if (store && _.isFunction(store.sync)) {
                    return store.sync.apply(that, args);
                } else {
                    return Backbone.sync.apply(that, args);
                }
            });
        },

        /**
         * save all containing models
         */
        save: function() {
            this.each(function(model) {
                model.save();
            });
        },

        getUrlParams: function (url) {
            url = url || this.getUrl();
            var m = url.match(/\?([^#]*)/);
            var params = {};
            if (m && m.length > 1) {
                _.each(m[1].split('&'), function (p) {
                    var a = p.split('=');
                    params[a[0]] = a[1];
                });
            }
            return params;
        },

        getUrl: function (collection) {
            return (_.isFunction(this.url) ? this.url() : this.url) || '';
        },

        getUrlRoot: function () {
            var url = this.getUrl();
            return url ? ( url.indexOf('?') >= 0 ? url.substr(0, url.indexOf('?')) : url) : '';
        },

        applyFilter: function (callback) {
            this.trigger('filter', this.filter(callback));
        },

        _updateUrl: function () {
            var params = this.getUrlParams();
            if (this.options) {
                this.url = this.getUrlRoot();
                if (this.options.query) {
                    params.query = encodeURIComponent(JSON.stringify(this.options.query));
                }
                if (this.options.fields) {
                    params.fields = encodeURIComponent(JSON.stringify(this.options.fields));
                }
                if (this.options.sort) {
                    params.sort = encodeURIComponent(JSON.stringify(this.options.sort));
                }
                if (!_.isEmpty(params)) {
                    this.url += '?';
                    var a = [];
                    for (var k in params) {
                        a.push(k + (params[k] ? '=' + params[k] : ''));
                    }
                    this.url += a.join('&');
                }
            }
        }

    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    // Bikini.DataSelector uses code from meteor.js
    // https://github.com/meteor/meteor/tree/master/packages/minimongo
    //
    // Thanks for sharing!

    /**
     *
     * @module Bikini.DataSelector
     *
     * @type {*}
     * @extends Bikini.Object
     */
    Bikini.DataSelector = Bikini.Object.design({

        _type: 'Bikini.DataSelector',

        _selector: null,

        create: function (docSelector) {
            var selector = this.design({
                _selector: null
            });
            selector.init(docSelector);
            return selector;
        },

        init: function (docSelector) {
            this._selector = this.compileSelector(docSelector);
        },

        matches: function (value) {
            if (_.isFunction(this._selector)) {
                return this._selector(value);
            }
            return false;
        },

        hasOperators: function (valueSelector) {
            var theseAreOperators;
            for (var selKey in valueSelector) {
                var thisIsOperator = selKey.substr(0, 1) === '$';
                if (theseAreOperators === undefined) {
                    theseAreOperators = thisIsOperator;
                } else if (theseAreOperators !== thisIsOperator) {
                    throw new Error('Inconsistent selector: ' + valueSelector);
                }
            }
            return !!theseAreOperators;  // {} has no operators
        },

        // Given a selector, return a function that takes one argument, a
        // document, and returns true if the document matches the selector,
        // else false.
        compileSelector: function (selector) {
            // you can pass a literal function instead of a selector
            if ( _.isFunction(selector)) {
                return function (doc) {
                    return selector.call(doc);
                };
            }

            // shorthand -- scalars match _id
            if (this._selectorIsId(selector)) {
                return function (record) {
                    var id = _.isFunction(record.getId) ? record.getId() : (record._id || record.id);
                    return Bikini.Field.prototype.equals(id, selector);
                };
            }

            // protect against dangerous selectors.  falsey and {_id: falsey} are both
            // likely programmer error, and not what you want, particularly for
            // destructive operations.
            if (!selector || (('_id' in selector) && !selector._id)) {
                return function (doc) {
                    return false;
                };
            }

            // Top level can't be an array or true or binary.
            if (_.isBoolean(selector) || _.isArray(selector) || Bikini.Field.prototype.isBinary(selector)) {
                throw new Error('Invalid selector: ' + selector);
            }

            return this.compileDocSelector(selector);
        },

        // The main compilation function for a given selector.
        compileDocSelector: function (docSelector) {
            var that = Bikini.DataSelector;
            var perKeySelectors = [];
            _.each(docSelector, function (subSelector, key) {
                if (key.substr(0, 1) === '$') {
                    // Outer operators are either logical operators (they recurse back into
                    // this function), or $where.
                    if (!_.has(that.LOGICAL_OPERATORS, key)) {
                        throw new Error('Unrecognized logical operator: ' + key);
                    }
                    perKeySelectors.push(that.LOGICAL_OPERATORS[key](subSelector));
                } else {
                    var lookUpByIndex = that._makeLookupFunction(key);
                    var valueSelectorFunc = that.compileValueSelector(subSelector);
                    perKeySelectors.push(function (doc) {
                        var branchValues = lookUpByIndex(doc);
                        // We apply the selector to each 'branched' value and return true if any
                        // match. This isn't 100% consistent with MongoDB; eg, see:
                        // https://jira.mongodb.org/browse/SERVER-8585
                        return _.any(branchValues, valueSelectorFunc);
                    });
                }
            });

            return function (record) {
                var doc = _.isFunction(record.getData) ? record.getData() : record;
                return _.all(perKeySelectors, function (f) {
                    return f(doc);
                });
            };
        },

        compileValueSelector: function (valueSelector) {
            var that = Bikini.DataSelector;
            if (valueSelector === null) {  // undefined or null
                return function (value) {
                    return that._anyIfArray(value, function (x) {
                        return x === null;  // undefined or null
                    });
                };
            }

            // Selector is a non-null primitive (and not an array or RegExp either).
            if (!_.isObject(valueSelector)) {
                return function (value) {
                    return that._anyIfArray(value, function (x) {
                        return x === valueSelector;
                    });
                };
            }

            if (_.isRegExp(valueSelector)) {
                return function (value) {
                    if (_.isUndefined(value)) {
                        return false;
                    }
                    return that._anyIfArray(value, function (x) {
                        return valueSelector.test(x);
                    });
                };
            }

            // Arrays match either identical arrays or arrays that contain it as a value.
            if (_.isArray(valueSelector)) {
                return function (value) {
                    if (!_.isArray(value)) {
                        return false;
                    }
                    return that._anyIfArrayPlus(value, function (x) {
                        return that._equal(valueSelector, x);
                    });
                };
            }

            // It's an object, but not an array or regexp.
            if (this.hasOperators(valueSelector)) {
                var operatorFunctions = [];
                _.each(valueSelector, function (operand, operator) {
                    if (!_.has(that.VALUE_OPERATORS, operator)) {
                        throw new Error('Unrecognized operator: ' + operator);
                    }
                    operatorFunctions.push(that.VALUE_OPERATORS[operator](operand, valueSelector.$options));
                });
                return function (value) {
                    return _.all(operatorFunctions, function (f) {
                        return f(value);
                    });
                };
            }

            // It's a literal; compare value (or element of value array) directly to the
            // selector.
            return function (value) {
                return that._anyIfArray(value, function (x) {
                    return that._equal(valueSelector, x);
                });
            };
        },

        // _makeLookupFunction(key) returns a lookup function.
        //
        // A lookup function takes in a document and returns an array of matching
        // values.  This array has more than one element if any segment of the key other
        // than the last one is an array.  ie, any arrays found when doing non-final
        // lookups result in this function 'branching'; each element in the returned
        // array represents the value found at this branch. If any branch doesn't have a
        // final value for the full key, its element in the returned list will be
        // undefined. It always returns a non-empty array.
        //
        // _makeLookupFunction('a.x')({a: {x: 1}}) returns [1]
        // _makeLookupFunction('a.x')({a: {x: [1]}}) returns [[1]]
        // _makeLookupFunction('a.x')({a: 5})  returns [undefined]
        // _makeLookupFunction('a.x')({a: [{x: 1},
        //                                 {x: [2]},
        //                                 {y: 3}]})
        //   returns [1, [2], undefined]
        _makeLookupFunction: function (key) {
            var dotLocation = key.indexOf('.');
            var first, lookupRest, nextIsNumeric;
            if (dotLocation === -1) {
                first = key;
            } else {
                first = key.substr(0, dotLocation);
                var rest = key.substr(dotLocation + 1);
                lookupRest = this._makeLookupFunction(rest);
                // Is the next (perhaps final) piece numeric (ie, an array lookup?)
                nextIsNumeric = /^\d+(\.|$)/.test(rest);
            }

            return function (doc) {
                if (doc === null) { // null or undefined
                    return [undefined];
                }
                var firstLevel = doc[first];

                // We don't 'branch' at the final level.
                if (!lookupRest) {
                    return [firstLevel];
                }

                // It's an empty array, and we're not done: we won't find anything.
                if (_.isArray(firstLevel) && firstLevel.length === 0) {
                    return [undefined];
                }

                // For each result at this level, finish the lookup on the rest of the key,
                // and return everything we find. Also, if the next result is a number,
                // don't branch here.
                //
                // Technically, in MongoDB, we should be able to handle the case where
                // objects have numeric keys, but Mongo doesn't actually handle this
                // consistently yet itself, see eg
                // https://jira.mongodb.org/browse/SERVER-2898
                // https://github.com/mongodb/mongo/blob/master/jstests/array_match2.js
                if (!_.isArray(firstLevel) || nextIsNumeric) {
                    firstLevel = [firstLevel];
                }
                return Array.prototype.concat.apply([], _.map(firstLevel, lookupRest));
            };
        },

        _anyIfArray: function (x, f) {
            if (_.isArray(x)) {
                return _.any(x, f);
            }
            return f(x);
        },

        _anyIfArrayPlus: function (x, f) {
            if (f(x)) {
                return true;
            }
            return _.isArray(x) && _.any(x, f);
        },

        // Is this selector just shorthand for lookup by _id?
        _selectorIsId: function (selector) {
            return _.isString(selector) || _.isNumber(selector);
        },

        // deep equality test: use for literal document and array matches
        _equal: function (a, b) {
            return Bikini.Field.prototype._equals(a, b, true);
        },

        _cmp: function (a, b) {
            return Bikini.Field.prototype._cmp(a, b);
        },

        LOGICAL_OPERATORS: {
            '$and': function (subSelector) {
                if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
                    throw new Error('$and/$or/$nor must be nonempty array');
                }
                var subSelectorFunctions = _.map(subSelector, Bikini.DataSelector.compileDocSelector);
                return function (doc) {
                    return _.all(subSelectorFunctions, function (f) {
                        return f(doc);
                    });
                };
            },

            '$or': function (subSelector) {
                if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
                    throw new Error('$and/$or/$nor must be nonempty array');
                }
                var subSelectorFunctions = _.map(subSelector, Bikini.DataSelector.compileDocSelector);
                return function (doc) {
                    return _.any(subSelectorFunctions, function (f) {
                        return f(doc);
                    });
                };
            },

            '$nor': function (subSelector) {
                if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
                    throw new Error('$and/$or/$nor must be nonempty array');
                }
                var subSelectorFunctions = _.map(subSelector, Bikini.DataSelector.compileDocSelector);
                return function (doc) {
                    return _.all(subSelectorFunctions, function (f) {
                        return !f(doc);
                    });
                };
            },

            '$where': function (selectorValue) {
                if (!_.isFunction(selectorValue)) {
                    var value = selectorValue;
                    selectorValue = function() { return value; };
                }
                return function (doc) {
                    return selectorValue.call(doc);
                };
            }
        },

        VALUE_OPERATORS: {
            '$in': function (operand) {
                if (!_.isArray(operand)) {
                    throw new Error('Argument to $in must be array');
                }
                return function (value) {
                    return Bikini.DataSelector._anyIfArrayPlus(value, function (x) {
                        return _.any(operand, function (operandElt) {
                            return Bikini.DataSelector._equal(operandElt, x);
                        });
                    });
                };
            },

            '$all': function (operand) {
                if (!_.isArray(operand)) {
                    throw new Error('Argument to $all must be array');
                }
                return function (value) {
                    if (!_.isArray(value)) {
                        return false;
                    }
                    return _.all(operand, function (operandElt) {
                        return _.any(value, function (valueElt) {
                            return Bikini.DataSelector._equal(operandElt, valueElt);
                        });
                    });
                };
            },

            '$lt': function (operand) {
                return function (value) {
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return Bikini.DataSelector._cmp(x, operand) < 0;
                    });
                };
            },

            '$lte': function (operand) {
                return function (value) {
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return Bikini.DataSelector._cmp(x, operand) <= 0;
                    });
                };
            },

            '$gt': function (operand) {
                return function (value) {
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return Bikini.DataSelector._cmp(x, operand) > 0;
                    });
                };
            },

            '$gte': function (operand) {
                return function (value) {
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return Bikini.DataSelector._cmp(x, operand) >= 0;
                    });
                };
            },

            '$ne': function (operand) {
                return function (value) {
                    return !Bikini.DataSelector._anyIfArrayPlus(value, function (x) {
                        return Bikini.DataSelector._equal(x, operand);
                    });
                };
            },

            '$nin': function (operand) {
                if (!_.isArray(operand)) {
                    throw new Error('Argument to $nin must be array');
                }
                var inFunction = this.VALUE_OPERATORS.$in(operand);
                return function (value) {
                    // Field doesn't exist, so it's not-in operand
                    if (value === undefined) {
                        return true;
                    }
                    return !inFunction(value);
                };
            },

            '$exists': function (operand) {
                return function (value) {
                    return operand === (value !== undefined);
                };
            },
            '$mod': function (operand) {
                var divisor = operand[0], remainder = operand[1];
                return function (value) {
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return x % divisor === remainder;
                    });
                };
            },

            '$size': function (operand) {
                return function (value) {
                    return _.isArray(value) && operand === value.length;
                };
            },

            '$type': function (operand) {
                return function (value) {
                    // A nonexistent field is of no type.
                    if (_.isUndefined(value)) {
                        return false;
                    }
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return Bikini.Field.prototype.detectType(x) === operand;
                    });
                };
            },

            '$regex': function (operand, options) {

                if (_.isUndefined(options)) {
                    // Options passed in $options (even the empty string) always overrides
                    // options in the RegExp object itself.

                    // Be clear that we only support the JS-supported options, not extended
                    // ones (eg, Mongo supports x and s). Ideally we would implement x and s
                    // by transforming the regexp, but not today...
                    if (/[^gim]/.test(options)) {
                        throw new Error('Only the i, m, and g regexp options are supported');
                    }

                    var regexSource = _.isRegExp(operand) ? operand.source : operand;
                    operand = new RegExp(regexSource, options);
                } else if (!_.isRegExp(operand)) {
                    operand = new RegExp(operand);
                }

                return function (value) {
                    if (_.isUndefined(value)) {
                        return false;
                    }
                    return Bikini.DataSelector._anyIfArray(value, function (x) {
                        return operand.test(x);
                    });
                };
            },

            '$options': function (operand) {
                // evaluation happens at the $regex function above
                return function (value) {
                    return true;
                };
            },

            '$elemMatch': function (operand) {
                var matcher = Bikini.DataSelector.compileDocSelector(operand);
                return function (value) {
                    if (!_.isArray(value)) {
                        return false;
                    }
                    return _.any(value, function (x) {
                        return matcher(x);
                    });
                };
            },

            '$not': function (operand) {
                var matcher = Bikini.DataSelector.compileDocSelector(operand);
                return function (value) {
                    return !matcher(value);
                };
            }
        },

        // Give a sort spec, which can be in any of these forms:
        //   {'key1': 1, 'key2': -1}
        //   [['key1', 'asc'], ['key2', 'desc']]
        //   ['key1', ['key2', 'desc']]
        //
        // (.. with the first form being dependent on the key enumeration
        // behavior of your javascript VM, which usually does what you mean in
        // this case if the key names don't look like integers ..)
        //
        // return a function that takes two objects, and returns -1 if the
        // first object comes first in order, 1 if the second object comes
        // first, or 0 if neither object comes before the other.

        compileSort: function (spec) {
            var sortSpecParts = [];

            if (_.isArray(spec)) {
                for (var i = 0; i < spec.length; i++) {
                    if (typeof spec[i] === 'string') {
                        sortSpecParts.push({
                            lookup: this._makeLookupFunction(spec[i]),
                            ascending: true
                        });
                    } else {
                        sortSpecParts.push({
                            lookup: this._makeLookupFunction(spec[i][0]),
                            ascending: spec[i][1] !== 'desc'
                        });
                    }
                }
            } else if (typeof spec === 'object') {
                for (var key in spec) {
                    sortSpecParts.push({
                        lookup: this._makeLookupFunction(key),
                        ascending: spec[key] >= 0
                    });
                }
            } else {
                throw new Error('Bad sort specification: ', JSON.stringify(spec));
            }

            if (sortSpecParts.length === 0) {
                return function () {
                    return 0;
                };
            }

            // reduceValue takes in all the possible values for the sort key along various
            // branches, and returns the min or max value (according to the bool
            // findMin). Each value can itself be an array, and we look at its values
            // too. (ie, we do a single level of flattening on branchValues, then find the
            // min/max.)
            var reduceValue = function (branchValues, findMin) {
                var reduced;
                var first = true;
                // Iterate over all the values found in all the branches, and if a value is
                // an array itself, iterate over the values in the array separately.
                _.each(branchValues, function (branchValue) {
                    // Value not an array? Pretend it is.
                    if (!_.isArray(branchValue)) {
                        branchValue = [branchValue];
                    }
                    // Value is an empty array? Pretend it was missing, since that's where it
                    // should be sorted.
                    if (_.isArray(branchValue) && branchValue.length === 0) {
                        branchValue = [undefined];
                    }
                    _.each(branchValue, function (value) {
                        // We should get here at least once: lookup functions return non-empty
                        // arrays, so the outer loop runs at least once, and we prevented
                        // branchValue from being an empty array.
                        if (first) {
                            reduced = value;
                            first = false;
                        } else {
                            // Compare the value we found to the value we found so far, saving it
                            // if it's less (for an ascending sort) or more (for a descending
                            // sort).
                            var cmp = Bikini.DataSelector._cmp(reduced, value);
                            if ((findMin && cmp > 0) || (!findMin && cmp < 0)) {
                                reduced = value;
                            }
                        }
                    });
                });
                return reduced;
            };

            return function (a, b) {
                a = a.attributes ? a.attributes : a;
                b = b.attributes ? b.attributes : b;
                for (var i = 0; i < sortSpecParts.length; ++i) {
                    var specPart = sortSpecParts[i];
                    var aValue = reduceValue(specPart.lookup(a), specPart.ascending);
                    var bValue = reduceValue(specPart.lookup(b), specPart.ascending);
                    var compare = Bikini.DataSelector._cmp(aValue, bValue);
                    if (compare !== 0) {
                        return specPart.ascending ? compare : -compare;
                    }
                }
                return 0;
            };
        }

    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     *
     * @module Bikini.SqlSelector
     *
     * @type {*}
     * @extends Bikini.DataSelector
     */
    Bikini.SqlSelector = Bikini.DataSelector.design({

        _type: 'Bikini.SqlSelector',

        _selector: null,
        _query: null,
        _entity: null,

        create: function (docSelector, entity) {
            var selector = this.extend({
                _entity: entity,
                _selector: null,
                _query: null
            });
            selector.init(docSelector);

            return selector;
        },

        init: function (docSelector) {
            this._selector = this.compileSelector(docSelector);
            this._query = this.buildSqlQuery(docSelector);
        },

        buildStatement: function (obj) {
            return this._query;
        },

        buildSqlQuery: function (selector, connector) {
            // you can pass a literal function instead of a selector
            if (selector instanceof Function) {
                return '';
            }

            // shorthand -- sql
            if (_.isString(selector)) {
                return selector;
            }

            // protect against dangerous selectors.  falsey and {_id: falsey} are both
            // likely programmer error, and not what you want, particularly for
            // destructive operations.
            if (!selector || (('_id' in selector) && !selector._id)) {
                return '1=2';
            }

            // Top level can't be an array or true or binary.
            if (_.isBoolean(selector) || _.isArray(selector) || Bikini.DataField.isBinary(selector)) {
                throw new Error('Invalid selector: ' + selector);
            }

            return this.buildSqlWhere(selector)();
        },

        // The main compilation function for a given selector.
        buildSqlWhere: function (docSelector) {
            var where = '';
            var that = this;
            var perKeySelectors = [];
            _.each(docSelector, function (subSelector, key) {
                if (key.substr(0, 1) === '$') {
                    // Outer operators are either logical operators (they recurse back into
                    // this function), or $where.
                    perKeySelectors.push(that.buildLogicalOperator(key, subSelector));
                } else {
                    var valueLookup = that.buildLookup(key);
                    var valueSelector = that.buildValueSelector(subSelector);
                    if (_.isFunction(valueSelector)) {
                        perKeySelectors.push(function () {
                            return valueSelector(valueLookup);
                        });
                    }
                }
            });

            return function () {
                var sql = '';
                _.each(perKeySelectors, function (f) {
                    if (_.isFunction(f)) {
                        sql += f.call(that);
                    }
                });
                return sql;
            };
        },

        buildValueSelector: function (valueSelector) {
            var that = this;
            if (valueSelector === null) {  // undefined or null
                return function (key) {
                    return key + ' IS NULL';
                };
            }

            // Selector is a non-null primitive (and not an array or RegExp either).
            if (!_.isObject(valueSelector)) {
                return function (key) {
                    return key + ' = ' + that.buildValue(valueSelector);
                };
            }

            if (_.isRegExp(valueSelector)) {
                var regEx = valueSelector.toString();
                var match = regEx.match(/\/[\^]?([^^.*$'+()]*)[\$]?\//);
                if (match && match.length > 1) {
                    var prefix = regEx.indexOf('/^') < 0 ? '%' : '';
                    var suffix = regEx.indexOf('$/') < 0 ? '%' : '';
                    return function (key) {
                        return key + ' LIKE "' + prefix + match[1] + suffix + '"';
                    };
                }
                return null;
            }

            // Arrays match either identical arrays or arrays that contain it as a value.
            if (_.isArray(valueSelector)) {
                return null;
            }

            // It's an object, but not an array or regexp.
            if (this.hasOperators(valueSelector)) {
                var operatorFunctions = [];
                _.each(valueSelector, function (operand, operator) {
                    if (!_.has(that.VALUE_OPERATORS, operator)) {
                        throw new Error('Unrecognized operator: ' + operator);
                    }
                    operatorFunctions.push(that.VALUE_OPERATORS[operator](operand, that));
                });
                return function (key) {
                    return that.LOGICAL_OPERATORS.$and(operatorFunctions, key);
                };
            }

            // It's a literal; compare value (or element of value array) directly to the
            // selector.
            return function (key) {
                return key + ' = ' + that.buildValue(valueSelector);
            };
        },

        buildLookup: function (key) {
            var field = this._entity ? this._entity.getField(key) : null;
            key = field && field.name ? field.name : key;
            return '"' + key + '"';
        },

        buildValue: function (value) {
            if (_.isString(value)) {
                return '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        },

        buildLogicalOperator: function (operator, subSelector) {
            if (!_.has(this.LOGICAL_OPERATORS, operator)) {
                throw new Error('Unrecognized logical operator: ' + operator);
            } else {
                if (!_.isArray(subSelector) || _.isEmpty(subSelector)) {
                    throw new Error('$and/$or/$nor must be nonempty array');
                }
                var subSelectorFunction = _.map(subSelector, this.buildSqlWhere, this);
                var that = this;
                return function (key) {
                    return that.LOGICAL_OPERATORS[operator](subSelectorFunction, key);
                };
            }
        },

        LOGICAL_OPERATORS: {
            '$and': function (subSelectorFunction, key) {
                var sql = '';
                var count = 0;
                _.each(subSelectorFunction, function (f) {
                    var s = f !== null ? f(key) : '';
                    if (s) {
                        count++;
                        sql += sql ? ' AND ' + s : s;
                    }
                });
                return count > 1 ? '( ' + sql + ' )' : sql;
            },
            '$or': function (subSelectorFunction, key) {
                var sql = '';
                var miss = false;
                _.each(subSelectorFunction, function (f) {
                    var s = f !== null ? f(key) : '';
                    miss |= !s;
                    sql += sql && s ? ' OR ' + s : s;
                });
                return miss ? '' : '( ' + sql + ' )';
            },
            '$nor': function (subSelectorFunction, key) {
                var sql = '';
                var miss = false;
                _.each(subSelectorFunction, function (f) {
                    var s = f !== null ? f(key) : '';
                    miss |= !s;
                    sql += sql && s ? ' OR ' + s : s;
                });
                return miss ? '' : 'NOT ( ' + sql + ' )';
            }
        },

        VALUE_OPERATORS: {

            '$in': function (operand) {
                return null;
            },

            '$all': function (operand) {
                return null;
            },

            '$lt': function (operand, that) {
                return function (key) {
                    return key + ' < ' + that.buildValue(operand);
                };
            },

            '$lte': function (operand, that) {
                return function (key) {
                    return key + ' <= ' + that.buildValue(operand);
                };
            },

            '$gt': function (operand, that) {
                return function (key) {
                    return key + ' > ' + that.buildValue(operand);
                };
            },

            '$gte': function (operand, that) {
                return function (key) {
                    return key + '' > '' + that.buildValue(operand);
                };
            },

            '$ne': function (operand, that) {
                return function (key) {
                    return key + ' <> ' + that.buildValue(operand);
                };
            },

            '$nin': function (operand) {
                return null;
            },

            '$exists': function (operand, that) {
                return function (key) {
                    return key + ' IS NOT NULL';
                };
            },

            '$mod': function (operand) {
                return null;
            },

            '$size': function (operand) {
                return null;
            },

            '$type': function (operand) {
                return null;
            },

            '$regex': function (operand, options) {
                return null;
            },
            '$options': function (operand) {
                return null;
            },

            '$elemMatch': function (operand) {
                return null;
            },

            '$not': function (operand, that) {
                var matcher = that.buildSqlWhere(operand);
                return function (key) {
                    return 'NOT (' + matcher(key) + ')';
                };
            }
        }
    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * Base class to build a custom data store.
     *
     * See: Bikini.LocalStorageStore, Bikini.WebSqlStore and Bikini.BikiniStore
     *
     * @module Bikini.Store
     *
     */
    Bikini.Store = function() {
        this.initialize.apply(this, arguments);
    };

    Bikini.Store.extend = Bikini.extend;
    Bikini.Store.create = Bikini.create;
    Bikini.Store.design = Bikini.design;

    // Attach all inheritable methods to the Connector prototype.
    _.extend(Bikini.Store.prototype, Backbone.Events, Bikini.Object, {

        _type: 'Bikini.Store',

        entities: null,

        options: null,

        name: '',

        typeMapping: (function() {
            var map = {};
            map [Bikini.DATA.TYPE.OBJECTID] = Bikini.DATA.TYPE.STRING;
            map [Bikini.DATA.TYPE.DATE] = Bikini.DATA.TYPE.STRING;
            map [Bikini.DATA.TYPE.BINARY] = Bikini.DATA.TYPE.TEXT;
            return map;
        })(),

        initialize: function( options ) {
            options = options || {};
            this.options = this.options || {};
            this.options.name = this.name;
            this.options.typeMapping = this.typeMapping;
            this.options.entities = this.entities;
            _.extend(this.options, options || {});

            this._setEntities(options.entities || {});
        },

        _setEntities: function( entities ) {
            this.entities = {};
            for( var name in entities ) {
                var entity = Bikini.Entity.from(entities[name], {
                    store: this,
                    typeMapping: this.options.typeMapping
                });
                entity.name = entity.name || name;

                // connect collection and model to this store
                var collection = entity.collection || Bikini.Collection.extend({ model: Bikini.Model.extend({}) });
                var model = collection.prototype.model;
                // set new entity and name
                collection.prototype.entity = model.prototype.entity = name;
                collection.prototype.store = model.prototype.store = this;
                entity.idAttribute = entity.idAttribute || model.prototype.idAttribute;
                this.entities[name] = entity;
            }
        },

        getEntity: function( obj ) {
            if( obj ) {
                var entity = obj.entity || obj;
                var name = _.isString(entity) ? entity : entity.name;
                if( name ) {
                    return this.entities[name] || (entity && entity.name ? entity : { name: name });
                }
            }
        },

        getCollection: function( entity ) {
            if( _.isString(entity) ) {
                entity = this.entities[entity];
            }
            if( entity && entity.collection ) {
                if( Bikini.Collection.prototype.isPrototypeOf(entity.collection) ) {
                    return entity.collection;
                } else {
                    return new entity.collection();
                }
            }
        },

        createModel: function( entity, attrs ) {
            if( _.isString(entity) ) {
                entity = this.entities[entity];
            }
            if( entity && entity.collection ) {
                var Model = entity.collection.model || entity.collection.prototype.model;
                if( Model ) {
                    return new Model(attrs);
                }
            }
        },

        getArray: function( data ) {
            if( _.isArray(data) ) {
                return data;
            } else if( Bikini.isCollection(data) ) {
                return data.models;
            }
            return _.isObject(data) ? [ data ] : [];
        },

        getDataArray: function( data ) {
            var array = [];
            if( _.isArray(data) || Backbone.Collection.prototype.isPrototypeOf(data) ) {
                _.each(data, function( d ) {
                    var attrs = this.getAttributes(d);
                    if( attrs ) {
                        array.push(attrs);
                    }
                });
            } else {
                var attrs = this.getAttributes(data);
                if( attrs ) {
                    array.push(this.getAttributes(attrs));
                }
            }
            return array;
        },

        getAttributes: function( model ) {
            if( Backbone.Model.prototype.isPrototypeOf(model) ) {
                return model.attributes;
            }
            return _.isObject(model) ? model : null;
        },

        initModel: function( model ) {
        },

        initCollection: function( collection ) {
        },

        initEntity: function( entity ) {
        },

        sync: function( method, model, options ) {
        },

        /**
         *
         * @param collection usally a collection, but can also be a model
         * @param options
         */
        fetch: function( collection, options ) {
            if( collection && !collection.models && !collection.attributes && !options ) {
                options = collection;
            }
            if( (!collection || (!collection.models && !collection.attributes)) && options && options.entity ) {
                collection = this.getCollection(options.entity);
            }
            if( collection && collection.fetch ) {
                var opts = _.extend({}, options || {}, { store: this });
                collection.fetch(opts);
            }
        },

        create: function( collection, model, options ) {
            if( collection && !collection.models && !options ) {
                model = collection;
                options = model;
            }
            if( (!collection || !collection.models) && options && options.entity ) {
                collection = this.getCollection(options.entity);
            }
            if( collection && collection.create ) {
                var opts = _.extend({}, options || {}, { store: this });
                collection.create(model, opts);
            }
        },

        save: function( model, attr, options ) {
            if( model && !model.attributes && !options ) {
                attr = model;
                options = attr;
            }
            if( (!model || !model.attributes) && options && options.entity ) {
                model = this.createModel(options.entity);
            }
            if( model && model.save ) {
                var opts = _.extend({}, options || {}, { store: this });
                model.save(attr, opts);
            }
        },

        destroy: function( model, options ) {
            if( model && model.destroy ) {
                var opts = _.extend({}, options || {}, { store: this });
                model.destroy(opts);
            }
        },

        _checkEntity: function( obj, entity ) {
            if( !Bikini.isEntity(entity) ) {
                var error = Bikini.Store.CONST.ERROR_NO_ENTITY;
                console.error(error);
                this.handleCallback(obj.error, error);
                this.handleCallback(obj.finish, error);
                return false;
            }
            return true;
        },

        _checkData: function( obj, data ) {
            if( (!_.isArray(data) || data.length === 0) && !_.isObject(data) ) {
                var error = Bikini.Store.CONST.ERROR_NO_DATA;
                console.error(error);
                this.handleCallback(obj.error, error);
                this.handleCallback(obj.finish, error);
                return false;
            }
            return true;
        },

        handleSuccess: function( obj ) {
            var args = Array.prototype.slice.call(arguments, 1);
            if( obj.success ) {
                this.handleCallback.apply(this, [ obj.success ].concat(args));
            }
            if( obj.finish ) {
                this.handleCallback.apply(this, [ obj.finish ].concat(args));
            }
        },

        handleError: function( obj ) {
            var args = Array.prototype.slice.call(arguments, 1);
            if( obj.error ) {
                this.handleCallback.apply(this, [ obj.error ].concat(args));
            }
            if( obj.finish ) {
                this.handleCallback.apply(this, [ obj.finish ].concat(args));
            }
        },

        CONST: {
            ERROR_NO_ENTITY: 'No valid entity specified. ',
            ERROR_NO_DATA:   'No data passed. ',
            ERROR_LOAD_DATA: 'Error while loading data from store. ',
            ERROR_SAVE_DATA: 'Error while saving data to the store. ',
            ERROR_LOAD_IDS:  'Error while loading ids from store. ',
            ERROR_SAVE_IDS:  'Error while saving ids to the store. '
        }

    });

    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * The Bikini.LocalStorageStore can be used to store model collection into
     * the localStorage
     *
     * @module Bikini.LocalStorageStore
     *
     * @type {*}
     * @extends Bikini.Store
     *
     * @example
     *
     * // The LocalStorageStore will save each model data as a json under his id,
     * // and keeps all id's under an extra key for faster access
     *
     * var MyCollection = Bikini.Collection.extend({
     *      store: Bikini.LocalStorageStore.create(),
     *      entity: 'myEntityName'
     * });
     *
     */
    Bikini.LocalStorageStore = Bikini.Store.extend({

        _type: 'Bikini.LocalStorageStore',

        ids: {},

        sync: function( method, model, options ) {
            options = options || {};
            var that = options.store || this.store;
            var entity = that.getEntity(model.entity || options.entity || this.entity);
            var attrs;
            if( that && entity && model ) {
                var id = model.id || (method === 'create' ? new Bikini.ObjectID().toHexString() : null);
                attrs = options.attrs || model.toJSON(options);
                switch( method ) {
                    case 'patch':
                    case 'update':
                    case 'create':
                        if (method !== 'create') {
                            attrs = _.extend(that._getItem(entity, id) || {}, attrs);
                        }
                        if( model.id !== id && model.idAttribute ) {
                            attrs[model.idAttribute] = id;
                        }
                        that._setItem(entity, id, attrs);
                        break;
                    case 'delete' :
                        that._removeItem(entity, id);
                        break;
                    case 'read' :
                        if( id ) {
                            attrs = that._getItem(entity, id);
                        } else {
                            attrs = [];
                            var ids = that._getItemIds(entity);
                            for( id in ids ) {
                                var itemData = that._getItem(entity, id);
                                if( itemData ) {
                                    attrs.push(itemData);
                                }
                            }
                        }
                        break;
                    default:
                        return;
                }
            }
            if( attrs ) {
                that.handleSuccess(options, attrs);
            } else {
                that.handleError(options, Bikini.Store.CONST.ERROR_NO_ENTITY);
            }
        },

        drop: function( options ) {
            var entity = this.getEntity(options);
            if( entity && entity.name ) {
                var keys   = this._findAllKeys(entity);
                for (var i=0; i<keys.length; i++) {
                    localStorage.removeItem(keys[i]);
                }
                localStorage.removeItem('__ids__' + entity.name);
                this.handleSuccess(options);
            } else {
                this.handleError(options, Bikini.Store.CONST.ERROR_NO_ENTITY);
            }
        },

        _getKey: function( entity, id ) {
            return '_' + entity.name + '_' + id;
        },

        _getItem: function( entity, id ) {
            var attrs;
            if( entity && id ) {
                try {
                    attrs = JSON.parse(localStorage.getItem(this._getKey(entity, id)));
                    if( attrs ) {
                        entity.setId(attrs, id); // fix id
                    } else {
                        this._delItemId(id);
                    }
                } catch( e ) {
                    console.error(Bikini.Store.CONST.ERROR_LOAD_DATA + e.message);
                }
            }
            return attrs;
        },

        _setItem: function( entity, id, attrs ) {
            if( entity && id && attrs ) {
                try {
                    localStorage.setItem(this._getKey(entity, id), JSON.stringify(attrs));
                    this._addItemId(entity, id);
                } catch( e ) {
                    console.error(Bikini.Store.CONST.ERROR_SAVE_DATA + e.message);
                }
            }
        },

        _removeItem: function( entity, id ) {
            if( entity && id ) {
                localStorage.removeItem(this._getKey(entity, id));
                this._delItemId(entity, id);
            }
        },

        _addItemId: function( entity, id ) {
            var ids = this._getItemIds(entity);
            if( !(id in ids) ) {
                ids[id] = '';
                this._saveItemIds(entity, ids);
            }
        },

        _delItemId: function( entity, id ) {
            var ids = this._getItemIds(entity);
            if( id in ids ) {
                delete ids[id];
                this._saveItemIds(entity, ids);
            }
        },

        _findAllKeys: function (entity) {
            var keys = [];
            var prefixItem = this._getKey(entity, '');
            if( prefixItem ) {
                var key, len = localStorage.length;
                for (var i=0; i < len; i++) {
                    key = localStorage.key(i);
                    if (key && key === prefixItem) {
                        keys.push(key);
                    }
                }
            }
            return keys;
        },

        _getItemIds: function( entity ) {
            try {
                var key = '__ids__' + entity.name;
                if( !this.ids[entity.name] ) {
                    this.ids[entity.name] = JSON.parse(localStorage.getItem(key)) || {};
                }
                return this.ids[entity.name];
            } catch( e ) {
                console.error(Bikini.Store.CONST.ERROR_LOAD_IDS + e.message);
            }
        },

        _saveItemIds: function( entity, ids ) {
            try {
                var key = '__ids__' + entity.name;
                localStorage.setItem(key, JSON.stringify(ids));
            } catch( e ) {
                console.error(Bikini.Store.CONST.ERROR_SAVE_IDS + e.message);
            }
        }
    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * The Bikini.WebSqlStore can be used to store model collection into
     * the webSql database
     *
     * @module Bikini.WebSqlStore
     *
     * @type {*}
     * @extends Bikini.Store
     *
     * @example
     *
     * // The default configuration will save the complete model data as json
     * // into a database column with the name "data"
     *
     * var MyCollection = Bikini.Collection.extend({
     *      model: MyModel,
     *      entity: 'MyTableName',
     *      store: new Bikini.WebSqlStorageStore()
     * });
     *
     * // If you want to use specific columns you can specify the fields
     * // in the entity of your model like this:
     *
     * var MyModel = Bikini.Model.extend({
     *      idAttribute: 'id',
     *      fields: {
     *          id:          { type: Bikini.DATA.TYPE.STRING,  required: YES, index: YES },
     *          sureName:    { name: 'USERNAME', type: Bikini.DATA.TYPE.STRING },
     *          firstName:   { type: Bikini.DATA.TYPE.STRING,  length: 200 },
     *          age:         { type: Bikini.DATA.TYPE.INTEGER }
     *      }
     * });
     *
     *
     */
    Bikini.WebSqlStore = Bikini.Store.extend({

        _type: 'Bikini.WebSqlStore',

        _selector: null,

        options: null,

        name: 'themproject',

        size: 1024 * 1024, // 1 MB

        version: '1.0',

        db: null,

        dataField: { name: 'data', type: 'text', required: true },

        idField: { name: 'id', type: 'string', required: true },

        typeMapping: (function() {
            var map = {};
            map [Bikini.DATA.TYPE.OBJECTID] = Bikini.DATA.TYPE.STRING;
            map [Bikini.DATA.TYPE.DATE] = Bikini.DATA.TYPE.STRING;
            map [Bikini.DATA.TYPE.OBJECT] = Bikini.DATA.TYPE.TEXT;
            map [Bikini.DATA.TYPE.ARRAY] = Bikini.DATA.TYPE.TEXT;
            map [Bikini.DATA.TYPE.BINARY] = Bikini.DATA.TYPE.TEXT;
            return map;
        })(),

        sqlTypeMapping: (function() {
            var map = {};
            map [Bikini.DATA.TYPE.STRING] = 'varchar(255)';
            map [Bikini.DATA.TYPE.TEXT] = 'text';
            map [Bikini.DATA.TYPE.OBJECT] = 'text';
            map [Bikini.DATA.TYPE.ARRAY] = 'text';
            map [Bikini.DATA.TYPE.FLOAT] = 'float';
            map [Bikini.DATA.TYPE.INTEGER] = 'integer';
            map [Bikini.DATA.TYPE.DATE] = 'varchar(255)';
            map [Bikini.DATA.TYPE.BOOLEAN] = 'boolean';
            return map;
        })(),

        initialize: function( options ) {
            Bikini.Store.prototype.initialize.apply(this, arguments);
            this.options = this.options || {};
            this.options.name = this.name;
            this.options.size = this.size;
            this.options.version = this.version;
            this.options.typeMapping = this.typeMapping;
            this.options.sqlTypeMapping = this.sqlTypeMapping;
            _.extend(this.options, options || {});

            this._openDb({
                error: function( msg ) {
                    console.error(msg);
                }
            });
        },

        sync: function( method, model, options ) {
            var that = options.store || this.store;
            var models = Bikini.isCollection(model) ? model.models : [ model ];
            options.entity = options.entity || this.entity;
            switch( method ) {
                case 'create':
                    that._checkTable(options, function() {
                        that._insertOrReplace(models, options);
                    });
                    break;

                case 'update':
                case 'patch':
                    that._checkTable(options, function() {
                        that._insertOrReplace(models, options);
                    });
                    break;

                case 'delete':
                    that._delete(models, options);
                    break;

                case 'read':
                    that._select(this, options);
                    break;

                default:
                    break;
            }
        },

        select: function( options ) {
            this._select(null, options);
        },

        drop: function( options ) {
            this._dropTable(options);
        },

        createTable: function( options ) {
            this._createTable(options);
        },

        execute: function( options ) {
            this._executeSql(options);
        },


        /**
         * @private
         */
        _openDb: function( options ) {
            var error, dbError;
            /* openDatabase(db_name, version, description, estimated_size, callback) */
            if( !this.db ) {
                try {
                    if( !window.openDatabase ) {
                        error = 'Your browser does not support WebSQL databases.';
                    } else {
                        this.db = window.openDatabase(this.options.name, '', '', this.options.size);
                        if( this.entities ) {
                            for( var key in this.entities ) {
                                this._createTable({ entity: this.entities[key] });
                            }
                        }
                    }
                } catch( e ) {
                    dbError = e;
                }
            }
            if( this.db ) {
                if( this.options.version && this.db.version !== this.options.version ) {
                    this._updateDb(options);
                } else {
                    this.handleSuccess(options, this.db);
                }
            } else if( dbError === 2  || dbError === '2') {
                // Version number mismatch.
                this._updateDb(options);
            } else {
                if( !error && dbError ) {
                    error = dbError;
                }
                this.handleSuccess(options, error);
            }
        },

        _updateDb: function( options ) {
            var error;
            var lastSql;
            var that = this;
            try {
                var db = window.openDatabase(this.options.name, '', '', this.options.size);
                try {
                    var arSql = this._sqlUpdateDatabase(db.version, this.options.version);
                    db.changeVersion(db.version, this.options.version, function( tx ) {
                        _.each(arSql, function( sql ) {
                            console.log('sql statement: ' + sql);
                            lastSql = sql;
                            tx.executeSql(sql);
                        });
                    }, function( msg ) {
                        that.handleError(options, msg, lastSql);
                    }, function() {
                        that.handleSuccess(options);
                    });
                } catch( e ) {
                    error = e.message;
                    console.error('webSql change version failed, DB-Version: ' + db.version);
                }
            } catch( e ) {
                error = e.message;
            }
            if( error ) {
                this.handleError(options, error);
            }
        },

        _sqlUpdateDatabase: function( oldVersion, newVersion ) {
            // create sql array, simply drop and create the database
            var sql = [];
            if( this.entities ) {
                for( var name in this.entities ) {
                    var entity = this.entities[name];
                    sql.push(this._sqlDropTable(entity.name));
                    sql.push(this._sqlCreateTable(entity));
                }
            }
            return sql;
        },

        _sqlDropTable: function( name ) {
            return 'DROP TABLE IF EXISTS \'' + name + '\'';
        },

        _isAutoincrementKey: function( entity, key ) {
            if( entity && key ) {
                var column = this.getField(entity, key);
                return column && column.type === Bikini.DATA.TYPE.INTEGER;
            }
        },

        _sqlPrimaryKey: function( entity, keys ) {
            if( keys && keys.length === 1 ) {
                if( this._isAutoincrementKey(entity, keys[0]) ) {
                    return keys[0] + ' INTEGER PRIMARY KEY ASC AUTOINCREMENT UNIQUE';
                } else {
                    return keys[0] + ' PRIMARY KEY ASC UNIQUE';
                }
            }
            return '';
        },

        _sqlConstraint: function( entity, keys ) {
            if( keys && keys.length > 1 ) {
                return 'PRIMARY KEY (' + keys.join(',') + ') ON CONFLICT REPLACE';
            }
            return '';
        },

        _sqlCreateTable: function( entity ) {
            var that = this;
            var keys = entity.getKeys();
            var primaryKey = keys.length === 1 ? this._sqlPrimaryKey(entity, keys) : '';
            var constraint = keys.length > 1 ? this._sqlConstraint(entity, keys) : (entity.constraint || '');

            var columns = '';
            var fields = this.getFields(entity);
            _.each(fields, function( field ) {
                // skip ID, it is defined manually above
                if( !primaryKey || field.name !== keys[0] ) {
                    // only add valid types
                    var attr = that._dbAttribute(field);
                    if( attr ) {
                        columns += (columns ? ', ' : '') + attr;
                    }
                }
            });
            if( !columns ) {
                columns = this._dbAttribute(this.dataField);
            }
            var sql = 'CREATE TABLE IF NOT EXISTS \'' + entity.name + '\' (';
            sql += primaryKey ? primaryKey + ', ' : '';
            sql += columns;
            sql += constraint ? ', ' + constraint : '';
            sql += ');';
            return sql;
        },

        _sqlDelete: function(options, entity ) {
            var sql = 'DELETE FROM \'' + entity.name + '\'';
            var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
            if( where ) {
                sql += ' WHERE ' + where;
            }
            sql += options.and ? ' AND ' + options.and : '';
            return sql;
        },

        _sqlWhere: function( options, entity ) {
            this._selector = null;
            var sql = '';
            if( _.isString(options.where) ) {
                sql = options.where;
            } else if( _.isObject(options.where) ) {
                this._selector = Bikini.SqlSelector.create(options.where, entity);
                sql = this._selector.buildStatement();
            }
            return sql;
        },

        _sqlWhereFromData: function(options, entity ) {
            var that = this;
            var ids = [];
            if( options && options.models && entity && entity.idAttribute ) {
                var id, key = entity.idAttribute;
                var field = this.getField(entity, key);
                _.each(options.models, function( model ) {
                    id = model.id;
                    if( !_.isUndefined(id) ) {
                        ids.push(that._sqlValue(id, field));
                    }
                });
                if( ids.length > 0 ) {
                    return key + ' IN (' + ids.join(',') + ')';
                }
            }
            return '';
        },

        _sqlSelect: function( options, entity ) {

            var sql = 'SELECT ';
            if( options.fields ) {
                if( options.fields.length > 1 ) {
                    sql += options.fields.join(', ');
                } else if( options.fields.length === 1 ) {
                    sql += options.fields[0];
                }
            } else {
                sql += '*';
            }
            sql += ' FROM \'' + entity.name + '\'';
            if( options.join ) {
                sql += ' JOIN ' + options.join;
            }

            if( options.leftJoin ) {
                sql += ' LEFT JOIN ' + options.leftJoin;
            }

            var where = this._sqlWhere(options, entity) || this._sqlWhereFromData(options, entity);
            if( where ) {
                sql += ' WHERE ' + where;
            }

            if( options.order ) {
                sql += ' ORDER BY ' + options.order;
            }

            if( options.limit ) {
                sql += ' LIMIT ' + options.limit;
            }

            if( options.offset ) {
                sql += ' OFFSET ' + options.offset;
            }

            return sql;
        },

        _sqlValue: function( value, field ) {
            var type = field && field.type ? field.type : Bikini.Field.prototype.detectType(value);
            if( type === Bikini.DATA.TYPE.INTEGER || type === Bikini.DATA.TYPE.FLOAT ) {
                return value;
            } else if( type === Bikini.DATA.TYPE.BOOLEAN ) {
                return value ? '1' : '0';
            } else if( type === Bikini.DATA.TYPE.NULL ) {
                return 'NULL';
            }
            value = Bikini.Field.prototype.transform(value, Bikini.DATA.TYPE.STRING);
            value = value.replace(/"/g, '""');
            return '"' + value + '"';
        },

        _dbAttribute: function( field ) {
            if( field && field.name ) {
                var type = this.options.sqlTypeMapping[field.type];
                var isReqStr = field.required ? ' NOT NULL' : '';
                if( type ) {
                    return field.name + ' ' + type.toUpperCase() + isReqStr;
                }
            }
        },

        _dropTable: function( options ) {

            var entity = this.getEntity(options);
            entity.db = null;

            if( this._checkDb(options) && entity ) {
                var sql = this._sqlDropTable(entity.name);
                // reset flag
                this._executeTransaction(options, [sql]);
            }
        },

        _createTable: function( options ) {

            var entity = this.getEntity(options);
            entity.db = this.db;

            if( this._checkDb(options) && this._checkEntity(options, entity) ) {
                var sql = this._sqlCreateTable(entity);
                // reset flag
                this._executeTransaction(options, [sql]);
            }
        },

        _checkTable: function( options, callback ) {
            var entity = this.getEntity(options);
            var that = this;
            if( entity && !entity.db ) {
                this._createTable({
                    success: function() {
                        callback();
                    },
                    error: function( error ) {
                        this.handleError(options, error);
                    },
                    entity: entity
                });
            } else {
                callback();
            }
        },

        _insertOrReplace: function( models, options ) {

            var entity = this.getEntity(options);

            if( this._checkDb(options) && this._checkEntity(options, entity) && this._checkData(options, models) ) {

                var isAutoInc = this._isAutoincrementKey(entity, entity.getKey());
                var statements = [];
                var sqlTemplate = 'INSERT OR REPLACE INTO \'' + entity.name + '\' (';
                for( var i = 0; i < models.length; i++ ) {
                    var model = models[i];
                    var statement = ''; // the actual sql insert string with values
                    if( !isAutoInc && !model.id && model.idAttribute ) {
                        model.set(model.idAttribute, new Bikini.ObjectID().toHexString());
                    }
                    var value = options.attrs || model.toJSON();
                    var args, keys;
                    if( !_.isEmpty(entity.fields) ) {
                        args = _.values(value);
                        keys = _.keys(value);
                    } else {
                        args = [ model.id, JSON.stringify(value) ];
                        keys = [ 'id', 'data'];
                    }
                    if( args.length > 0 ) {
                        var values = new Array(args.length).join('?,') + '?';
                        var columns = '\'' + keys.join('\',\'') + '\'';
                        statement += sqlTemplate + columns + ') VALUES (' + values + ');';
                        statements.push({ statement: statement, arguments: args });
                    }
                }
                this._executeTransaction(options, statements);
            }
        },

        _select: function( result, options ) {

            var entity = this.getEntity(options);

            if( this._checkDb(options) && this._checkEntity(options, entity) ) {
                var lastStatement;
                var isCollection = Bikini.isCollection(result);
                if( isCollection ) {
                    result = [];
                } else {
                    options.models = [ result ];
                }
                var stm = this._sqlSelect(options, entity);
                var that = this;
                this.db.readTransaction(function( t ) {
                    var statement = stm.statement || stm;
                    var args = stm.arguments;
                    lastStatement = statement;
                    console.log('sql statement: ' + statement);
                    if( args ) {
                        console.log('    arguments: ' + JSON.stringify(args));
                    }
                    t.executeSql(statement, args, function( tx, res ) {
                        var len = res.rows.length;//, i;
                        for( var i = 0; i < len; i++ ) {
                            var item = res.rows.item(i);
                            var attrs;
                            if( !_.isEmpty(entity.fields) || !that._hasDefaultFields(item) ) {
                                attrs = item;
                            } else {
                                try {
                                    attrs = JSON.parse(item.data);
                                } catch( e ) {
                                }
                            }
                            if( attrs && (!that._selector || that._selector.matches(attrs)) ) {
                                if( isCollection ) {
                                    result.push(attrs);
                                } else {
                                    result = attrs;
                                    break;
                                }
                            }
                        }
                    }, function (t, e) {
                        // error
                        console.error('webSql error: ' + e.message);
                    });
                }, function( sqlError ) { // errorCallback
                    console.error('WebSql Syntax Error: ' + sqlError.message);
                    that.handleError(options, sqlError.message, lastStatement);
                }, function() { // voidCallback (success)
                    that.handleSuccess(options, result);
                });
            }
        },

        _delete: function( models, options ) {
            var entity = this.getEntity(options);
            if( this._checkDb(options) && this._checkEntity(options, entity) ) {
                options.models = models;
                var sql = this._sqlDelete(options, entity);
                // reset flag
                this._executeTransaction(options, [sql]);
            }
        },

        _executeSql: function( options ) {
            if( options.sql ) {
                this._executeTransaction(options, [options.sql]);
            }
        },

        _executeTransaction: function( options, statements ) {
            var error;
            var lastStatement;
            if( this._checkDb(options) ) {
                var that = this;
                try {
                    /* transaction has 3 parameters: the transaction callback, the error callback and the success callback */
                    this.db.transaction(function( t ) {
                        _.each(statements, function( stm ) {
                            var statement = stm.statement || stm;
                            var args = stm.arguments;
                            lastStatement = statement;
                            console.log('sql statement: ' + statement);
                            if( args ) {
                                console.log('    arguments: ' + JSON.stringify(args));
                            }
                            t.executeSql(statement, args);
                        });
                    }, function( sqlError ) { // errorCallback
                        console.error(sqlError.message);
                        that.handleError(options, sqlError.message, lastStatement);
                    }, function() {
                        that.handleSuccess(options);
                    });
                } catch( e ) {
                    console.error(e.message);
                }
            }
            if( error ) {
                this.handleCallback(options.error, error, lastStatement);
            }
        },

        _hasDefaultFields: function( item ) {
            return _.every(_.keys(item), function( key ) {
                return key === this.idField.name || key === this.dataField.name;
            }, this);
        },

        _checkDb: function( options ) {
            // has to be initialized first
            if( !this.db ) {
                var error = 'db handler not initialized.';
                console.error(error);
                this.handleError(options, error);
                return false;
            }
            return true;
        },

        getFields: function( entity ) {
            if( !_.isEmpty(entity.fields) ) {
                return entity.fields;
            } else {
                var fields = {};
                fields.data = this.dataField;
                var idAttribute = entity.idAttribute || 'id';
                fields[idAttribute] = this.idField;
                return fields;
            }
        },

        getField: function( entity, key ) {
            return this.getFields(entity)[key];
        }

    });
    // Copyright (c) 2013 M-Way Solutions GmbH
    // http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

    /**
     * The Bikini.BikiniStore is used to connect a model collection to an
     * bikini server.
     *
     * This will give you an online and offline store with live data updates.
     *
     * @module Bikini.BikiniStore
     *
     * @type {*}
     * @extends Bikini.Store
     *
     * @example
     *
     * // The default configuration will save the complete model data as a json,
     * // and the offline change log to a local WebSql database, synchronize it
     * // trough REST calls with the server and receive live updates via a socket.io connection.
     *
     * var MyCollection = Bikini.Collection.extend({
     *      model: MyModel,
     *      url: 'http://myBikiniServer.com:8200/bikini/myCollection',
     *      store: new Bikini.BikiniStore( {
     *          useLocalStore:   YES, // (default) store the data for offline use
     *          useSocketNotify: YES, // (default) register at the server for live updates
     *          useOfflineChanges: YES // (default) allow changes to the offline data
     *      })
     * });
     *
     */
    Bikini.BikiniStore = Bikini.Store.extend({

        _type: 'Bikini.BikiniStore',

        _selector: null,

        endpoints: {},

        options: null,

        localStore: Bikini.WebSqlStore,

        useLocalStore: YES,

        useSocketNotify: YES,

        useOfflineChanges: YES,

        isConnected: NO,

        typeMapping: {
            'binary': 'text',
            'date': 'string'
        },

        initialize: function( options ) {
            Bikini.Store.prototype.initialize.apply(this, arguments);
            this.options = this.options || {};
            this.options.useLocalStore = this.useLocalStore;
            this.options.useSocketNotify = this.useSocketNotify;
            this.options.useOfflineChanges = this.useOfflineChanges;
            this.options.socketPath = this.socketPath;
            this.options.localStore = this.localStore;
            this.options.typeMapping = this.typeMapping;
            if( this.options.useSocketNotify && typeof io !== 'object' ) {
                console.log('Socket.IO not present !!');
                this.options.useSocketNotify = NO;
            }
            _.extend(this.options, options || {});
        },

        initModel: function( model ) {
        },

        initCollection: function( collection ) {
            var url = collection.getUrlRoot();
            var entity = this.getEntity(collection.entity);
            if( url && entity ) {
                var name = entity.name;
                var hash = this._hashCode(url);
                var credentials = entity.credentials || collection.credentials;
                var user = credentials && credentials.username ? credentials.username : '';
                var channel = name + user + hash;
                collection.channel = channel;
                // get or create endpoint for this url
                var that = this;
                var endpoint = this.endpoints[hash];
                if( !endpoint ) {
                    var href = this.getLocation(url);
                    endpoint = {};
                    endpoint.baseUrl = url;
                    endpoint.readUrl = collection.getUrl();
                    endpoint.host = href.protocol + '//' + href.host;
                    endpoint.path = href.pathname;
                    endpoint.entity = entity;
                    endpoint.channel = channel;
                    endpoint.credentials = credentials;
                    endpoint.socketPath = this.options.socketPath;
                    endpoint.localStore = this.createLocalStore(endpoint);
                    endpoint.messages = this.createMsgCollection(endpoint);
                    endpoint.socket = this.createSocket(endpoint);
                    endpoint.info = this.fetchServerInfo(endpoint);
                    that.endpoints[hash] = endpoint;
                }
                collection.endpoint = endpoint;
                collection.listenTo(this, endpoint.channel, this.onMessage, collection);
            }
        },

        getEndpoint: function( url ) {
            if( url ) {
                var hash = this._hashCode(url);
                return this.endpoints[hash];
            }
        },

        createLocalStore: function( endpoint, idAttribute ) {
            if( this.options.useLocalStore && endpoint ) {
                var entities = {};
                entities[endpoint.entity.name] = {
                    name: endpoint.channel,
                    idAttribute: idAttribute
                };
                return this.options.localStore.create({
                    entities: entities
                });
            }
        },

        createMsgCollection: function( endpoint ) {
            if( this.options.useOfflineChanges && endpoint ) {
                var messages = Bikini.Collection.design({
                    url: endpoint.url,
                    entity: 'msg-' + endpoint.channel,
                    store: this.options.localStore.create()
                });
                var that = this;
                messages.fetch({
                    success: function() {
                        that.sendMessages(endpoint);
                    }
                });
                return messages;
            }
        },

        createSocket: function( endpoint, name ) {
            if( this.options.useSocketNotify && endpoint.socketPath && endpoint ) {
                var that = this;
                var url  = endpoint.host;
                var path = endpoint.path;
                path = endpoint.socketPath || (path + (path.charAt(path.length - 1) === '/' ? '' : '/' ) + 'live');
                // remove leading /
                var resource = (path && path.indexOf('/') === 0) ? path.substr(1) : path;

                endpoint.socket = io.connect(url, { resource: resource });
                endpoint.socket.on('connect', function() {
                    that._bindChannel(endpoint, name);
                    that.onConnect(endpoint);
                });
                endpoint.socket.on('disconnect', function() {
                    console.log('socket.io: disconnect');
                    that.onDisconnect(endpoint);
                });
                return endpoint.socket;
            }
        },

        _bindChannel: function(endpoint, name ) {
            var that = this;
            if (endpoint && endpoint.socket) {
                var channel = endpoint.channel;
                var socket  = endpoint.socket;
                var time    = this.getLastMessageTime(channel);
                name = name || endpoint.entity.name;
                socket.on(channel, function( msg ) {
                    if( msg ) {
                        that.trigger(channel, msg);
                        if (that.options.useLocalStore) {
                            that.setLastMessageTime(channel, msg.time);
                        }
                    }
                });
                socket.emit('bind', {
                    entity: name,
                    channel: channel,
                    time: time
                });
            }
        },

        getLastMessageTime: function( channel ) {
            return localStorage.getItem('__' + channel + 'last_msg_time') || 0;
        },

        setLastMessageTime: function( channel, time ) {
            if( time ) {
                localStorage.setItem('__' + channel + 'last_msg_time', time);
            }
        },

        _hashCode: function( str ) {
            var hash = 0, char;
            if( str.length === 0 ) {
                return hash;
            }
            for( var i = 0, l = str.length; i < l; i++ ) {
                char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },

        onConnect: function( endpoint ) {
            this.isConnected = YES;
            this.fetchChanges(endpoint );
            this.sendMessages(endpoint );
        },

        onDisconnect: function(endpoint) {
            this.isConnected = NO;
            if (endpoint.socket && endpoint.socket.socket) {
                endpoint.socket.socket.onDisconnect();
            }
        },

        onMessage: function( msg ) {
            if( msg && msg.method ) {
                var localStore = this.endpoint ? this.endpoint.localStore : null;
                var options = {
                    store: localStore,
                    entity: this.entity,
                    merge: YES,
                    fromMessage: YES,
                    parse: YES
                };
                var attrs = msg.data;

                switch( msg.method ) {
                    case 'patch':
                    case 'update':
                    case 'create':
                        options.patch = msg.method === 'patch';
                        var model = msg.id ? this.get(msg.id) : null;
                        if( model ) {
                            model.save(attrs, options);
                        } else {
                            this.create(attrs, options);
                        }
                        break;
                    case 'delete':
                        if( msg.id ) {
                            if( msg.id === 'all' ) {
                                while( (model = this.first()) ) {
                                    if( localStore ) {
                                        localStore.sync.apply(this, [
                                            'delete',
                                            model,
                                            { store: localStore, fromMessage: YES }
                                        ]);
                                    }
                                    this.remove(model);
                                }
                                this.store.setLastMessageTime(this.endpoint.channel, '');
                            } else {
                                var msgModel = this.get(msg.id);
                                if( msgModel ) {
                                    msgModel.destroy(options);
                                }
                            }
                        }
                        break;

                    default:
                        break;
                }
            }
        },

        sync: function( method, model, options ) {
            var that = options.store || this.store;
            if( options.fromMessage ) {
                return that.handleCallback(options.success);
            }
            var endpoint = that.getEndpoint(this.getUrlRoot());
            if( that && endpoint ) {
                var channel = this.channel;

                if( Bikini.isModel(model) && !model.id ) {
                    model.set(model.idAttribute, new Bikini.ObjectID().toHexString());
                }

                var time = that.getLastMessageTime(channel);
                // only send read messages if no other store can do this
                // or for initial load
                if( method !== 'read' || !endpoint.localStore || !time ) {
                    // do backbone rest
                    that.addMessage(method, model, // we don't need to call callbacks if an other store handle this
                        endpoint.localStore ? {} : options, endpoint);
                } else if( method === 'read' ) {
                    that.fetchChanges(endpoint);
                }
                if( endpoint.localStore ) {
                    options.store = endpoint.localStore;
                    endpoint.localStore.sync.apply(this, arguments);
                }
            }
        },

        addMessage: function( method, model, options, endpoint ) {
            var that = this;
            if( method && model ) {
                var changes = model.changedSinceSync;
                var data = null;
                var storeMsg = YES;
                switch( method ) {
                    case 'update':
                    case 'create':
                        data = options.attrs || model.toJSON();
                        break;

                    case 'patch':
                        if( _.isEmpty(changes) ) {
                            return;
                        }
                        data = model.toJSON({ attrs: changes });
                        break;

                    case 'delete':
                        break;

                    default:
                        storeMsg = NO;
                        break;
                }
                var msg = {
                    _id: model.id,
                    id: model.id,
                    method: method,
                    data: data
                };
                var emit = function( endpoint, msg ) {
                    that.emitMessage(endpoint, msg, options, model);
                };
                if( storeMsg ) {
                    this.storeMessage(endpoint, msg, emit);
                } else {
                    emit(endpoint, msg);
                }
            }
        },

        emitMessage: function( endpoint, msg, options, model ) {
            var channel = endpoint.channel;
            var that = this;
            var url = Bikini.isModel(model) || msg.method !== 'read' ? endpoint.baseUrl : endpoint.readUrl;
            if( msg.id && msg.method !== 'create' ) {
                url += (url.charAt(url.length - 1) === '/' ? '' : '/' ) + msg.id;
            }
            model.sync.apply(model, [msg.method, model, {
                url: url,
                error: function( xhr, status ) {
                    if( !xhr.responseText && that.options.useOfflineChanges ) {
                        // this seams to be only a connection problem, so we keep the message an call success
                        that.onDisconnect(endpoint);
                        that.handleCallback(options.success, msg.data);
                    } else {
                        that.removeMessage(endpoint, msg, function( endpoint, msg ) {
                            // Todo: revert changed data
                            that.handleCallback(options.error, status);
                        });
                    }
                },
                success: function( data ) {
                    if (!that.isConnected) {
                        that.onConnect(endpoint);
                    }
                    that.removeMessage(endpoint, msg, function( endpoint, msg ) {
                        if( options.success ) {
                            var resp = data;
                            that.handleCallback(options.success, resp);
                        } else {
                            // that.setLastMessageTime(channel, msg.time);
                            if( msg.method === 'read' ) {
                                var array = _.isArray(data) ? data : [ data ];
                                for( var i = 0; i < array.length; i++ ) {
                                    data = array[i];
                                    if( data ) {
                                        that.trigger(channel, {
                                            id: data._id,
                                            method: 'update',
                                            data: data
                                        });
                                    }
                                }
                            } else {
                                that.trigger(channel, msg);
                            }
                        }
                    });
                },
                store: {}
            }]);
        },

        fetchChanges: function( endpoint ) {
            var that = this;
            var channel = endpoint ? endpoint.channel : '';
            var time = that.getLastMessageTime(channel);
            if( endpoint && endpoint.baseUrl && channel && time ) {
                var changes = new Bikini.Collection({});
                changes.fetch({
                    url: endpoint.baseUrl + '/changes/' + time,
                    success: function() {
                        changes.each(function( msg ) {
                            if( msg.time && msg.method ) {
                                if (that.options.useLocalStore) {
                                    that.setLastMessageTime(channel, msg.time);
                                }
                                that.trigger(channel, msg);
                            }
                        });
                    },
                    credentials: endpoint.credentials
                });
            }
        },

        fetchServerInfo: function( endpoint ) {
            var that = this;
            if( endpoint && endpoint.baseUrl ) {
                var info = new Bikini.Model();
                var time = that.getLastMessageTime(endpoint.channel);
                info.fetch({
                    url: endpoint.baseUrl + '/info',
                    success: function() {
                        if( !time && info.get('time') ) {
                            that.setLastMessageTime(endpoint.channel, info.get('time'));
                        }
                        if( !endpoint.socketPath && info.get('socketPath') ) {
                            endpoint.socketPath = info.get('socketPath');
                            var name = info.get('entity') || endpoint.entity.name;
                            if( that.options.useSocketNotify ) {
                                that.createSocket(endpoint, name);
                            }
                        }
                    },
                    credentials: endpoint.credentials
                });
            }
        },

        sendMessages: function( endpoint ) {
            if( endpoint && endpoint.messages ) {
                var that = this;
                endpoint.messages.each(function( message ) {
                    var msg;
                    try {
                        msg = JSON.parse(message.get('msg'));
                    } catch( e ) {
                    }
                    var channel = message.get('channel');
                    if( msg && channel ) {
                        var model = that.createModel({ collection: endpoint.messages }, msg.data);
                        that.emitMessage(endpoint, msg, {}, model);
                    } else {
                        message.destroy();
                    }
                });
            }
        },

        mergeMessages: function( data, id ) {
            return data;
        },

        storeMessage: function( endpoint, msg, callback ) {
            if( endpoint && endpoint.messages && msg ) {
                var channel = endpoint.channel;
                var message = endpoint.messages.get(msg._id);
                if( message ) {
                    var oldMsg = JSON.parse(message.get('msg'));
                    message.save({
                        msg: JSON.stringify(_.extend(oldMsg, msg))
                    });
                } else {
                    endpoint.messages.create({
                        _id: msg._id,
                        id: msg.id,
                        msg: JSON.stringify(msg),
                        channel: channel
                    });
                }
            }
            callback(endpoint, msg);
        },

        removeMessage: function( endpoint, msg, callback ) {
            if( endpoint && endpoint.messages ) {
                var message = endpoint.messages.get(msg._id);
                if( message ) {
                    message.destroy();
                }
            }
            callback(endpoint, msg);
        },

        clear: function( collection ) {
            if( collection ) {
                var endpoint = this.getEndpoint(collection.getUrlRoot());
                if( endpoint ) {
                    if( endpoint.messages ) {
                        endpoint.messages.destroy();
                    }
                    collection.reset();
                    this.setLastMessageTime(endpoint.channel, '');
                }
            }
        },

        /*
         url = "http://example.com:3000/pathname/?search=test#hash";

         location.protocol; // => "http:"
         location.host;     // => "example.com:3000"
         location.hostname; // => "example.com"
         location.port;     // => "3000"
         location.pathname; // => "/pathname/"
         location.hash;     // => "#hash"
         location.search;   // => "?search=test"
         */
        getLocation: function( url ) {
            var location = document.createElement('a');
            location.href = url || this.url;
            // IE doesn't populate all link properties when setting .href with a relative URL,
            // however .href will return an absolute URL which then can be used on itself
            // to populate these additional fields.
            if( location.host === '' ) {
                location.href = location.href;
            }
            return location;
        }
    });


})(this, Backbone, _, $);
