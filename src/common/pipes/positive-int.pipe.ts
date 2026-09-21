import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Valida que un parámetro de ruta sea un entero positivo (>= 1).
 * Nota: con `transform: true` el ValidationPipe global ya puede haber convertido
 * el valor a number, por eso acepta string | number.
 */
@Injectable()
export class PositiveIntPipe implements PipeTransform<string | number, number> {
  transform(value: string | number): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException(
        'El identificador de la ruta debe ser un entero positivo',
      );
    }
    return parsed;
  }
}
