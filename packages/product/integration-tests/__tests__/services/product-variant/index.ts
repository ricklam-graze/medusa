import { TestDatabase } from "../../../utils"
import { ProductVariantService } from "@services"
import { ProductVariantRepository } from "@repositories"
import { ProductVariant } from "@models"
import { SqlEntityManager } from "@mikro-orm/postgresql"

describe("ProductVariant Service", () => {
  let service
  let testManager: SqlEntityManager
  let repositoryManager
  let variantOne
  let variantTwo

  beforeEach(async () => {
    await TestDatabase.setupDatabase()
    repositoryManager = TestDatabase.forkManager()
    const productVariantRepository = new ProductVariantRepository({
      manager: repositoryManager,
    })

    service = new ProductVariantService({ productVariantRepository })
  })

  afterEach(async () => {
    await TestDatabase.clearDatabase()
  })

  describe("list", () => {
    beforeEach(async () => {
      testManager = TestDatabase.forkManager()

      variantOne = testManager.create(ProductVariant, {
        id: "test-1",
        title: "variant 1",
        inventory_quantity: 10,
      } as any)

      variantTwo = testManager.create(ProductVariant, {
        id: "test-2",
        title: "variant",
        inventory_quantity: 10,
      } as any)

      await testManager.persistAndFlush([variantOne])
    })

    // TODO
    it.only("selecting by properties, scopes out the results", async () => {
      const results = await service.list({
        where: {
          id: variantOne.id,
        },
        findOptions: {
          fields: ["id", "title"],
        },
      })

      console.log(JSON.stringify(results, null, 4))

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
          title: "variant 1",
          // TODO: why is this a string?
          inventory_quantity: "10",
        }),
      ])
    })

    // TODO
    it("passing a limit, scopes the result to the limit", async () => {
      const results = await service.list({
        findOptions: {
          limit: 1,
        },
      })

      expect(results).toEqual([
        expect.objectContaining({
          id: variantOne.id,
        }),
      ])
    })

    // TODO
    it("passing populate, scopes the results of the response", async () => {
      const results = await service.list({
        where: {
          id: "test-1",
        },
        findOptions: {
          fields: ["id", "title"],
          populate: [],
          limit: 1,
        },
      })
      console.log("results - ", results)
      expect(results).toEqual([
        {
          id: variantOne.id,
        },
      ])
    })
  })
})
