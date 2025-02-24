

interface ImageViewProps {
    rectangle: any
}


export default function ImageView({rectangle}: ImageViewProps) {


                        return (
                            <div className='w-40 h-40'>
                                <div>
                                    <img  id="gridimg" src={'https://www.gmrt.org/services/ImageServer.php?maptool=1&north='
                                     + rectangle.north  + '&west=' + rectangle.west + '&east=' + 
                                     rectangle.east + '&south=' + rectangle.south + '&mask=0'} />
                                </div>
                            </div>
                        )
}