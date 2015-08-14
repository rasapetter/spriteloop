#!/bin/bash

# Convert a GIF animation to a single image containing
# all of the individual frames stacked on top of each
# other.
#
# Usage: explode.sh <PATH_TO_GIF> <JPEG_QUALITY> (default: 80)

INPUT=$1
QUALITY=$2

# Make sure that the input is a GIF animation
TYPE=`file -ib ${INPUT} | grep "image/gif"`
if [ -z "${INPUT}" ] || [ -z "${TYPE}" ] ; then
	echo "Usage: ${0} <PATH_TO_GIF> <JPEG_QUALITY> (default: 80)"
	exit
fi
if [ -z "${QUALITY}" ] ; then
	QUALITY=80
fi

# Explode the GIF into JPEG frames
BASENAME=`basename ${INPUT} | cut -d. -f1`
convert ${INPUT} frame_%05d.jpg

# Merge the frames into a single JPEG
FRAMES=`ls frame*.jpg | wc -l`
convert `ls frame*.jpg | tr "\n" " "` -append -quality $QUALITY $BASENAME.jpg

# Clean up after ourselves
rm frame*.jpg

# Show the number of frames to the user
echo "Converted ${FRAMES} frames"
