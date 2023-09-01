import { AggregateRoot } from "../entities/agregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;
  private agregate: CustomAggreagate;

  constructor(aggreagate: CustomAggreagate) {
    this.ocurredAt = new Date();
    this.agregate = aggreagate;
  }
  getAggregateId(): UniqueEntityId {
    return this.agregate.id
  }
}

class CustomAggreagate extends AggregateRoot<null> {
  static create(){
    const aggregate = new CustomAggreagate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('DomainEvents', () => {
  it('should be able to dispatch events and listen to events', () => {
    const callbackSpy = vi.fn()
    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Estou criando uma resposta porém sem disparar o evento
    const aggregate = CustomAggreagate.create()

    //Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e assim disparando eventos
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz oque precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalledTimes(1)
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})