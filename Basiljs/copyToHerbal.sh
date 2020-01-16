#! /bin/bash
# Script to copy 'dist/' to 'herbal3d@dreamhost.com:herbal3d.org/Basil/'

if [[ -z "${H3DHOST}" ]] ; then
    echo "You must set the environment variable H3DHOST to the remote host to copy the files to"
    exit 5
fi
H3DACCT=${H3DACCT:-herbal3d}

rsync -r --delete-after "dist/" "${H3DACCT}@${H3DHOST}:herbal3d.org/Basil"
