for file in ./*
do
	filename="${file%.*}"
	ffmpeg -i "$filename".mp3 "$filename".wav 
	oggenc -o "$filename".ogg "$filename".wav
done

