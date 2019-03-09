import * as THREE from 'three';
import MeshBVHNode from './MeshBVHNode.js';
import BVHConstructionContext from './BVHConstructionContext.js';
import { CENTER } from './Constants.js';

export default class MeshBVH {

	constructor( geo, options = {} ) {

		if ( ! geo.isBufferGeometry ) {

			throw new Error( 'MeshBVH: Only BufferGeometries are supported.' );

		} else if ( geo.attributes.position.isInterleavedBufferAttribute ) {

			throw new Error( 'MeshBVH: InterleavedBufferAttribute is not supported for the position attribute.' );

		} else if ( geo.index && geo.index.isInterleavedBufferAttribute ) {

			throw new Error( 'MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.' );

		}

		// default options
		options = Object.assign( {

			strategy: CENTER,
			maxDepth: 40,
			maxLeafTris: 10,
			verbose: true

		}, options );
		options.strategy = Math.max( 0, Math.min( 2, options.strategy ) );

		this._roots = this._buildTree( geo, options );


	}

	/* Private Functions */

	_ensureIndex( geo ) {

		if ( ! geo.index ) {

			const triCount = geo.attributes.position.count / 3;
			const indexCount = triCount * 3;
			const index = new ( triCount > 65535 ? Uint32Array : Uint16Array )( indexCount );
			geo.setIndex( new THREE.BufferAttribute( index, 1 ) );

			for ( let i = 0; i < indexCount; i ++ ) {

				index[ i ] = i;

			}

		}

	}

	// Computes the set of { offset, count } ranges which need independent BVH roots. Each
	// region in the geometry index that belongs to a different set of material groups requires
	// a separate BVH root, so that triangles indices belonging to one group never get swapped
	// with triangle indices belongs to another group. For example, if the groups were like this:
	//
	// [-------------------------------------------------------------]
	// |__________________|
	//   g0 = [0, 20]  |______________________||_____________________|
	//                      g1 = [16, 40]           g2 = [41, 60]
	//
	// we would need four BVH roots: [0, 15], [16, 20], [21, 40], [41, 60].
	//
	_getRootIndexRanges( geo ) {

		if ( ! geo.groups || ! geo.groups.length ) {

			return [ { offset: 0, count: geo.index.count / 3 } ];

		}

		const ranges = [];
		const rangeBoundaries = new Set();
		for ( const group of geo.groups ) {

			rangeBoundaries.add( group.start );
			rangeBoundaries.add( group.start + group.count );

		}

		// note that if you don't pass in a comparator, it sorts them lexicographically as strings :-(
		const sortedBoundaries = Array.from( rangeBoundaries.values() ).sort( ( a, b ) => a - b );
		for ( let i = 0; i < sortedBoundaries.length - 1; i ++ ) {

			const start = sortedBoundaries[ i ], end = sortedBoundaries[ i + 1 ];
			ranges.push( { offset: ( start / 3 ), count: ( end - start ) / 3 } );

		}
		return ranges;

	}

	_buildTree( geo, options ) {

		this._ensureIndex( geo );

		const ctx = new BVHConstructionContext( geo, options );
		let reachedMaxDepth = false;

		// either recursively splits the given node, creating left and right subtrees for it, or makes it a leaf node,
		// recording the offset and count of its triangles and writing them into the reordered geometry index.
		const splitNode = ( node, offset, count, depth = 0 ) => {

			if ( depth >= options.maxDepth ) {

				reachedMaxDepth = true;

			}

			// early out if we've met our capacity
			if ( count <= options.maxLeafTris || depth >= options.maxDepth ) {

				node.offset = offset;
				node.count = count;
				return node;

			}

			// Find where to split the volume
			const split = ctx.getOptimalSplit( node.boundingData, offset, count, options.strategy );
			if ( split.axis === - 1 ) {

				node.offset = offset;
				node.count = count;
				return node;

			}

			const splitOffset = ctx.partition( offset, count, split );

			// create the two new child nodes
			if ( splitOffset === offset || splitOffset === offset + count ) {

				node.offset = offset;
				node.count = count;

			} else {

				node.splitAxis = split.axis;

				// create the left child and compute its bounding box
				const left = node.left = new MeshBVHNode();
				const lstart = offset, lcount = splitOffset - offset;
				left.boundingData = ctx.getBounds( lstart, lcount, new Float32Array( 6 ) );
				splitNode( left, lstart, lcount, depth + 1 );

				// repeat for right
				const right = node.right = new MeshBVHNode();
				const rstart = splitOffset, rcount = count - lcount;
				right.boundingData = ctx.getBounds( rstart, rcount, new Float32Array( 6 ) );
				splitNode( right, rstart, rcount, depth + 1 );

			}

			return node;

		};

		const roots = [];
		const ranges = this._getRootIndexRanges( geo );

		for ( let range of ranges ) {

			const root = new MeshBVHNode();
			root.boundingData = ctx.getBounds( range.offset, range.count, new Float32Array( 6 ) );
			splitNode( root, range.offset, range.count );
			roots.push( root );

			if ( reachedMaxDepth && options.verbose ) {

				console.warn( `MeshBVH: Max depth of ${ options.maxDepth } reached when generating BVH. Consider increasing maxDepth.` );
				console.warn( this, geo );

			}

		}

		return roots;

	}

	raycast( mesh, raycaster, ray, intersects ) {

		for ( const root of this._roots ) {

			root.raycast( mesh, raycaster, ray, intersects );

		}

	}

	raycastFirst( mesh, raycaster, ray ) {

		let closestResult = null;

		for ( const root of this._roots ) {

			const result = root.raycastFirst( mesh, raycaster, ray );
			if ( result != null && ( closestResult == null || result.distance < closestResult.distance ) ) {

				closestResult = result;

			}

		}

		return closestResult;

	}

	geometrycast( mesh, geometry, geomToMesh ) {

		for ( const root of this._roots ) {

			if ( root.geometrycast( mesh, geometry, geomToMesh ) ) return true;

		}

		return false;

	}

	shapecast( mesh, intersectsBoundsFunc, intersectsTriangleFunc = null, orderNodesFunc = null ) {

		for ( const root of this._roots ) {

			if ( root.shapecast( mesh, intersectsBoundsFunc, intersectsTriangleFunc, orderNodesFunc ) ) return true;

		}

		return false;

	}

	boxcast( mesh, box, boxToMesh ) {

		for ( const root of this._roots ) {

			if ( root.boxcast( mesh, box, boxToMesh ) ) return true;

		}

		return false;

	}

	spherecast( mesh, sphere ) {

		for ( const root of this._roots ) {

			if ( root.spherecast( mesh, sphere ) ) return true;

		}

		return false;

	}

	distanceToGeometry( mesh, geom, matrix, thresold ) {

		for ( const root of this._roots ) {

			if ( root.distanceToGeometry( mesh, geom, matrix, thresold ) ) return true;

		}

		return false;

	}

	distanceToPoint( mesh, point, threshold ) {

		for ( const root of this._roots ) {

			if ( root.distanceToPoint( mesh, point, threshold ) ) return true;

		}

		return false;


	}

}
