import React from 'react';
import Masonry from 'react-masonry-component';
import Styles from './Gallery.css';
import { Link } from 'react-router-dom';

let masonryOptions = {
	transitionDuration: 0,
};

class Gallery extends React.Component {
	render() {
		let childElements = this.props.posts.map(function(post, key){
			return (
				<li key={key} className={ Styles.li_max }>
					<Link to={`/p/${post.id}`}>
						<img src={`/uploads/${post.thumbnail}`} className={ Styles.img_max } />
					</Link>
					<p className={ Styles.p_padding }>
						{ post.title }<br />
						by { post.username }
					</p>
				</li>
			);
		});

		return (
			<Masonry
				elementType={'ul'} 				// default 'div'
				options={masonryOptions} 		// default {}
				disableImagesLoaded={false} 	// default false
				updateOnEachImageLoad={false} 	// default false and works only if disableImagesLoaded is false
			>
				{childElements}
			</Masonry>
		);
	}
}

export default Gallery;