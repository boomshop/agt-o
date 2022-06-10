<?php
function resizeImage($image, $target, $width, $height, $max, $clip, $quality) {
	$filename = basename($image);
	$extension = strtolower(substr(strrchr($filename, '.'), 1));
	$purename = substr($filename, 0, strrpos($filename, '.'));
	$ext = strtolower(substr(strrchr($target, '.'), 1));

	$srcSize = getimagesize($image);
	$srcX = $srcSize[0];
	$srcY = $srcSize[1];
	$srcRatio = $srcX / $srcY;

	$clipX = 0;
	$clipY = 0;

	if(isset($width) and !isset($height)) {
		$destX = $width;
		$destY = $srcY / ($srcX / $destX);
	} else if(isset($height) and !isset($width)) {
		$destY = $height;
		$destX = $srcX / ($srcY / $destY);
	} else if(isset($height) and isset($width) and !isset($clip)) {
		$destY = $height;
		$destX = $width;
	} else if(isset($height) and isset($width) and isset($clip)) {
		list($clipStrX, $clipStrY) = explode('-', $clip);
		$destY = $height;
		$destX = $width;
		$destRatio = $destX / $destY;
		if($destRatio < $srcRatio) {
			#QUERFORMAT
			$clipY = 0;
			$clipX = (($srcX * ($destY / $srcY) - $destX) / ($destY / $srcY)) / 2;
			if($clipStrX == 'right' or $clipStrY == 'right') $clipX *= 2;
			else if($clipStrX == 'left' or $clipStrY == 'left') $clipX = 0;
			$srcX = $destX / ($destY / $srcY);
		} else if($destRatio > $srcRatio) {
			#HOCHFORMAT
			$clipX = 0;
			$clipY = (($srcY * ($destX / $srcX) - $destY) / ($destX / $srcX)) / 2;
			if($clipStrY == 'bottom' or $clipStrX == 'bottom') $clipY *= 2;
			else if($clipStrY == 'top' or $clipStrX == 'top') $clipY = 0;
			$srcY = $destY / ($destX / $srcX);
		}
	} else if(isset($max)) {
		if ($srcRatio == 1) {
				$destY = $max;
				$destX = $max;
		}
		if ($srcRatio > 1) {
				$destY = (($max / ($srcX / 100)) * $srcY) / 100;
			$destX = $max;
		}
		if ($srcRatio < 1) {
				$destX = (($max / ($srcY / 100)) * $srcX) / 100;
				$destY = $max;
		}
	}

	// CREATE
	$destImage = imageCreateTruecolor($destX, $destY);
	if($extension == 'jpg' || $extension == 'jpeg') {
		$srcImage = ImageCreateFromJpeg($image);
	} else if($extension == 'gif') {
		$srcImage = ImageCreateFromGif($image);
	} else if($extension == 'png') {
		$srcImage = ImageCreateFromPNG($image);
	}
	imageCopyResampled($destImage, $srcImage, 0, 0, $clipX, $clipY, $destX, $destY, $srcX, $srcY);
echo $image . '-'.file_exists($image).'-'.file_exists($target).'<br>';
	// OUTPUT
	if($ext == 'jpg' || $ext == 'jpeg') {
		Imagejpeg($destImage, $target, $quality);
	} else if($ext == 'gif') {
		if(function_exists('Imagegif')) {
			Imagegif($destImage, $target);
		}
	} else if($ext == 'png') {
		Imagepng($destImage, $target, 9);
	}

	// CLEANUP
	ImageDestroy($destImage);
	ImageDestroy($srcImage);
}
?>
