for file in ./*
do
	filename="${file%.*}"
	ffmpeg -i "$filename".wav "$filename".mp3 
	oggenc -o "$filename".ogg "$filename".wav
done

