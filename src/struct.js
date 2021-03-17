(function()
{

// utility pack and unpack functions to simplify magic
var common = {
	pack: function(method, dv, value, offset, c, littleendian)
	{
		if (!Array.isArray(value))
			value = [ value ];

		for (var i = 0; i < c; i++)
			dv[method](offset + i, value[i], littleendian);
	},
	unpack: function(method, dv, offset, c, littleendian)
	{
		var r = [];
		for (var i = 0; i < c; i++)
			r.push(dv[method](offset + i, littleendian));

		return r;
	}
};

// pack and unpacking for different types
var magic = {
	// byte array
	A : {
		length: 1,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setInt8', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getInt8', dv, offset, c, littleendian);
		}
	},
	// padding byte
	x : {
		length: 1,
		pack: function(dv, value, offset, c, littleendian)
		{
			for (var i = 0; i < c; i++)
				dv.setUint8(offset + i, 0);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			var r = [];
			for (var i = 0; i < c; i++)
				r.push(0);

			return r;
		}
	},
	// char
	c : {
		length: 1,
		pack: function(method, dv, value, offset, c, littleendian)
		{
			if (!Array.isArray(value))
				value = [ value ];
	
			for (var i = 0; i < c; i++)
				dv.setUint8(offset + i, value[i].charCodeAt(0));
		},
		unpack: function(method, dv, offset, c, littleendian)
		{
			var r = [];
			for (var i = 0; i < c; i++)
				r.push(String.fromCharCode(dv.getUint8(offset + i)));
	
			return r;
		}
	},
	// signed char
	b : {
		length: 1,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setInt8', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getInt8', dv, offset, c, littleendian);
		}
	},
	// unsigned char
	B : {
		length: 1,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setUint8', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getUint8', dv, offset, c, littleendian);
		}
	},
	// signed short
	h : {
		length: 2,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setInt16', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getInt16', dv, offset, c, littleendian);
		}
	},
	// unsigned short
	H : {
		length: 2,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setUint16', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getUint16', dv, offset, c, littleendian);
		}
	},
	// signed long 
	i : {
		length: 4,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setInt32', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getInt32', dv, offset, c, littleendian);
		}
	},
	// unsigned long
	I : {
		length: 4,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setUint32', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getUint32', dv, offset, c, littleendian);
		}
	},
	l : {
		length: 4,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setInt32', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getInt32', dv, offset, c, littleendian);
		}
	},
	// unsigned long
	L : {
		length: 4,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setUint32', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getUint32', dv, offset, c, littleendian);
		}
	},
	// char[]
	s : {
		length: 1, 
		pack: function(dv, value, offset, c, littleendian)
		{
			var val = new String(value[0]);

			for (var i = 0; i < c; i++)
			{
				var code = 0;

				if (i < val.length)
					code = val.charCodeAt(i);

				dv.setUint8(offset + i, code);
			}
			
		},
		unpack: function(dv, offset, c, littleendian)
		{
			var r = [];
			for (var i = 0; i < c; i++)
				r.push(String.fromCharCode(dv.getUint8(offset + i)));

			return [ r.join('') ];
		}
	},
	// float 
	f : {
		length: 4,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setFloat32', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getFloat32', dv, offset, c, littleendian);
		}
	},
	// double
	d : {
		length: 8,
		pack: function(dv, value, offset, c, littleendian)
		{
			common.pack('setFloat64', dv, value, offset, c, littleendian);
		},
		unpack: function(dv, offset, c, littleendian)
		{
			return common.unpack('getFloat64', dv, offset, c, littleendian);
		}
	}
};

// pattern of stuff we're looking for
var pattern = '(\\d+)?([AxcbBhHsfdiIlL])';

// determine the size of arraybuffer we'd need
var determineLength = function (fmt)
{
	var re = new RegExp(pattern, 'g'), m, sum = 0;

	while (m = re.exec(fmt))
		sum += (((m[1] == undefined) || (m[1] == '')) ? 1 : parseInt(m[1])) * magic[m[2]].length;

	return sum;
};

// pack a set of values, starting at offset, based on format
var pack = function(fmt, values, offset)
{
	var littleendian = (fmt.charAt(0) == '<');
	offset = offset ? offset : 0;

	var ab = new ArrayBuffer(determineLength(fmt)),
		dv = new DataView(ab),
		re = new RegExp(pattern, 'g'),
		m, c, l, i = 0;

	while (m = re.exec(fmt))
	{
		if (magic[m[2]] == undefined)
			throw new Error('Unknown format type');
		
		c = ((m[1]==undefined) || (m[1]=='')) ? 1 : parseInt(m[1]);
		l = magic[m[2]].length;

		if ((offset + (c * l)) > ab.length)
			return;

		var value = values.slice(i, i + 1);

		magic[m[2]].pack(dv, value, offset, c, littleendian);

		offset += c * l;
		i += 1;
	}

	return ab;
};

// unpack an arraybuffer, starting at offset, based on format
// returns an array
var unpack = function(fmt, ab, offset)
{
	var littleendian = (fmt.charAt(0) == '<'),
		offset = offset ? offset : 0;

	var results = [],
		re = new RegExp(pattern, 'g'),
		dv = new DataView(ab),
		m, c, l;

	while (m = re.exec(fmt))
	{
		if (magic[m[2]] == undefined)
			throw new Error('Unknown format type');
		
		c = ((m[1] == undefined) || (m[1] == '')) ? 1 : parseInt(m[1]);
		l = magic[m[2]].length;

		if ((offset + (c * l)) > ab.length)
			return;

		results = results.concat(magic[m[2]].unpack(dv, offset, c, littleendian));

		offset += c * l;
	}

	return results;
};

// external API
var struct = {
	pack: pack,
	unpack: unpack,
	calcLength: determineLength,

	// jspack compatible API
	Pack: pack,
	Unpack: unpack,
	CalcLength: determineLength
};

// publishing to the outside world
if (typeof module !== 'undefined' && module.exports)
	module.exports = struct;
else
	this.struct = struct;

}).call(this);