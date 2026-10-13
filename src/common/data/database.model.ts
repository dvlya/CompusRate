import type { Place } from '../../places/entities/place.entity.js';
import type { Review } from '../../reviews/entities/review.entity.js';

export interface Database {
  places: Place[];
  reviews: Review[];
}
