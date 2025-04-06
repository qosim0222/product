import { ApiProperty } from "@nestjs/swagger"

export class CreateProductDto {
    @ApiProperty({ example: "gentra" })

    name: string

    @ApiProperty({ example: 15000 })
    price: number

    @ApiProperty({ example: "black" })
    color: string

    @ApiProperty({ example: 1 })
    categoryId: number
}
