/**
 * The eager leaf of the book layer.
 *
 * Everything else the book renders — the voxel engine, the butterflies, the
 * ice, the wind, the deciphering text — loads behind a lazy boundary (see
 * `lazy.tsx`). These two names are the one exception: a zero-dependency
 * constant and a union type, needed by both the eager shims and the lazy
 * engine, that would otherwise force a shim -> dynamic-import -> shim edge
 * into the module graph.
 */

/** Mark a card as something the butterflies can announce and land on. */
export const ANNOUNCE_ATTR = 'data-announce'

/** Keys into the `MODELS` registry in the (lazy) voxelModels.ts. */
export type VoxelModelName = 'fish' | 'alembic' | 'letter' | 'scroll'
